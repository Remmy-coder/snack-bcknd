import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PaginationResponseDto } from "src/utils/pagination/response-dto";
import {
  BaseEntity,
  DeepPartial,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

export interface RelationOptions {
  relations?: string[];
  where?: Record<string, any>;
  orderBy?: Record<string, "ASC" | "DESC">;
}

export interface FilterOptions<T> {
  search?: string;
  searchFields?: (keyof T)[];
  filters?: Record<string, any>;
  sort?: {
    field: keyof T;
    order: "ASC" | "DESC";
  };
}

@Injectable()
export abstract class AbstractService<T extends BaseEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    private readonly defaultRelations?: string[],
  ) {}

  protected createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias || "entity");
  }

  async create(
    dto: DeepPartial<T>,
    options?: {
      beforeCreate?: (dto: DeepPartial<T>) => DeepPartial<T>;
      afterCreate?: (entity: T) => Promise<T>;
    },
  ): Promise<T> {
    const processedDto = options?.beforeCreate
      ? options.beforeCreate(dto)
      : dto;

    const entity = this.repository.create(processedDto);
    const savedEntity = await this.repository.save(entity);

    return options?.afterCreate
      ? await options.afterCreate(savedEntity)
      : savedEntity;
  }

  // Advanced find method with comprehensive filtering
  async find(options?: RelationOptions & FilterOptions<T>): Promise<T[]> {
    const queryBuilder = this.createQueryBuilder("entity");

    // Handle relations
    if (options?.relations || this.defaultRelations) {
      (options?.relations || this.defaultRelations)?.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    // Handle where conditions
    if (options?.where) {
      queryBuilder.andWhere(options.where);
    }

    // Handle search across multiple fields
    if (options?.search && options?.searchFields) {
      const searchConditions = options.searchFields
        .map((field) => `entity.${String(field)} LIKE :search`)
        .join(" OR ");

      queryBuilder.andWhere(searchConditions, {
        search: `%${options.search}%`,
      });
    }

    // Handle additional filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      });
    }

    // Handle sorting
    if (options?.sort) {
      queryBuilder.orderBy(
        `entity.${String(options.sort.field)}`,
        options.sort.order,
      );
    } else if (options?.orderBy) {
      Object.entries(options.orderBy).forEach(([key, order]) => {
        queryBuilder.addOrderBy(`entity.${key}`, order);
      });
    }

    return queryBuilder.getMany();
  }

  // Paginated find with advanced filtering
  async findPaginated(
    page = 1,
    limit = 10,
    options?: RelationOptions & FilterOptions<T>,
  ): Promise<PaginationResponseDto<T>> {
    const queryBuilder = this.createQueryBuilder("entity");

    // Apply the same filtering logic as in find method
    if (options?.relations || this.defaultRelations) {
      (options?.relations || this.defaultRelations)?.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    // Where conditions
    if (options?.where) {
      queryBuilder.andWhere(options.where);
    }

    // Search
    if (options?.search && options?.searchFields) {
      const searchConditions = options.searchFields
        .map((field) => `entity.${String(field)} LIKE :search`)
        .join(" OR ");

      queryBuilder.andWhere(searchConditions, {
        search: `%${options.search}%`,
      });
    }

    // Filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      });
    }

    // Sorting
    if (options?.sort) {
      queryBuilder.orderBy(
        `entity.${String(options.sort.field)}`,
        options.sort.order,
      );
    } else if (options?.orderBy) {
      Object.entries(options.orderBy).forEach(([key, order]) => {
        queryBuilder.addOrderBy(`entity.${key}`, order);
      });
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [data, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit,
      },
    };
  }

  // Find by ID with optional relations
  async findById(
    id: string,
    options?: {
      relations?: string[];
      throwOnNotFound?: boolean;
    },
  ): Promise<T | null> {
    const queryBuilder = this.createQueryBuilder("entity");
    queryBuilder.andWhere("entity.id = :id", { id });

    // Add relations if specified
    (options?.relations || this.defaultRelations)?.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    });

    const entity = await queryBuilder.getOne();

    if (!entity && (options?.throwOnNotFound ?? true)) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }

  // Soft delete or hard delete
  async delete(
    id: string,
    options?: {
      softDelete?: boolean;
      beforeDelete?: (entity: T) => Promise<void>;
    },
  ): Promise<T> {
    const entity = await this.findById(id);

    // Optional pre-delete hook
    if (options?.beforeDelete) {
      await options.beforeDelete(entity);
    }

    if (options?.softDelete && "deletedAt" in entity) {
      // Assuming soft deletable entities have a deletedAt field
      (entity as any).deletedAt = new Date();
      return this.repository.save(entity);
    }

    return this.repository.remove(entity);
  }

  // Bulk operations
  async bulkCreate(dtos: DeepPartial<T>[]): Promise<T[]> {
    const entities = dtos.map((dto) => this.repository.create(dto));
    return this.repository.save(entities);
  }

  async bulkUpdate(
    ids: string[],
    updateDto: DeepPartial<T>,
  ): Promise<T[]> {
    const entities = await this.repository.findByIds(ids);

    if (entities.length !== ids.length) {
      throw new BadRequestException("Some entities not found");
    }

    const updatedEntities = entities.map((entity) => {
      return { ...entity, ...updateDto };
    });

    return this.repository.save(updatedEntities);
  }
}
