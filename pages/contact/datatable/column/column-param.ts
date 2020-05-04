export interface ColumnParam{
    key: string,
    keyChild?: string,
    header: string,
    currency?:string,
    
    isCheckbox?:boolean,
    isDate?:boolean,
    isMoneyFormat?:boolean,
    isTimestamp?:boolean,
    isChild?:boolean,
    isTextCenter?:boolean,
    isClickAble?:any,
    isTrueFalse?:boolean,
    
    isAction?: boolean,
    isActionDelete?: boolean,
    isOnlyActionDynamic?: boolean,
    isActionDynamic?:any[],

    isFormatDate?:boolean;
}