export interface LazyLoadParam{
    url: string,
    keyLimit:string,
    keyOffset:string,
    keyData:string,
    keyTotalData:string,

    isPostUrl?:boolean,
    isGetUrl?:boolean,

    customParam?:string,
    customBody?:any,

    authKey?:string,

    forceUnloadTable?:boolean
}