export interface ApiResponse<DataType = unknown> {
    status  : boolean;
    message : string;
    data    : DataType;
    errors? : Record<string, string[]>;
}
