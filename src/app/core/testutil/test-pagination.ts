import { OrderDir, Paginated, PaginationParams } from '../util/store';
import { NetOrderDir, NetPaginated, NetPaginationParams, netPaginationParams } from '../util/net';

/**
 * Generates random {@link PaginationParams} with the given order-by for {@link PaginationParams.orderBy}.
 * @param orderBy The order-by field to set because of not being randomly generated.
 */
export function testGenRandomPaginationParams<O>(orderBy?: O): PaginationParams<O> {
  return {
    limit: Math.floor(Math.random() * 100),
    offset: Math.floor(Math.random() * 100),
    orderBy: orderBy,
    orderDir: Math.random() > 0.5 ? OrderDir.Asc : OrderDir.Desc,
  };
}

/**
 * Generates {@link NetPaginated} from the given {@link PaginationParams} and entries.
 * @param params The pagination params to generate from.
 * @param netOrderedBy The {@link NetPaginated.ordered_by} field in order to avoid passing a mapping function.
 * @param entries The actual entries which will be used to fill {@link NetPaginated.entries}, {@link
  *   NetPaginated.total} and {@link NetPaginated.retrieved}.
 */
export function testGenNetPaginated<O, T>(params: PaginationParams<O>, netOrderedBy: string | undefined, entries: T[]): NetPaginated<T> {
  return {
    entries: entries,
    ...netPaginationParams(params, _ => netOrderedBy),
    total: entries.length * 8,
    retrieved: entries.length,
  };
}

/**
 * Generates {@link NetPaginationParams} using {@link netPaginationParams}.
 * @param params The params to map from.
 * @param netOrderBy The target order-by field.
 */
export function testGenNetPaginationParams<O>(params: PaginationParams<O>, netOrderBy: string | undefined): NetPaginationParams {
  return netPaginationParams(params, _ => netOrderBy);
}

/**
 * Maps the given {@link NetPaginated} to {@link Paginated} using the given ordered-by and entries.
 * @param netPaginated The net-paginated to be mapped.
 * @param orderedBy The string representation of {@link Paginated.orderedBy}.
 * @param entries The mapped entries.
 */
export function testGenPaginatedFromNet<T>(netPaginated: NetPaginated<any>, orderedBy: string | undefined, entries: T[]): Paginated<T> {
  const list: Paginated<any> = new Paginated<any>(netPaginated.entries, {
    limit: netPaginated.limit,
    offset: netPaginated.offset,
    orderDir: netPaginated.order_dir == NetOrderDir.Asc ? OrderDir.Asc : OrderDir.Desc,
    orderedBy: netPaginated.ordered_by,
    retrieved: netPaginated.retrieved,
    total: netPaginated.total,
  });
  return list.changeResultType(entries);
}
