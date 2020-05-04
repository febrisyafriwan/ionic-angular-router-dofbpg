import { ColumnParam } from "./column/column-param";
import { PaginationParam } from "./pagination-param";
import { LazyLoadParam } from "./lazy-load-param";

export interface MutDatatableParam{
    columns : ColumnParam[],
    dataset? : any[],
    pagination?: PaginationParam,
    lazyLoad?: LazyLoadParam,
    isLockHeader?: boolean,
    isViewItemsPerPage?: boolean,
    isTextHeaderCenter?: boolean,
    isPagingCenter?: boolean,
    onlyShowAfterReload?: boolean,
    paramTrueFalse?: any[]
}