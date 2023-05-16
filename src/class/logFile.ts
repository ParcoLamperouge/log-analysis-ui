export class logFile {
    fileName: string = "";
    data: string[] = [];
}
// const levelMap = {
//     I: 'info',
//     W: 'warning',
//     E: 'error'
// }
export class LogDataItem {
    private id: number;
    private rawString: string;
    // private bgClass: string;

    // TODO 临时使用public ，快速迭代
    public timestamp: string;
    public level: string;
    public threadID: string;
    public methodName: string;
    public fileName: string;
    public lineNumber: number;
    public text: string;
    constructor(
        id: number = 0,
        rawString: string = "",
        timestamp: string = "",
        level: string = "",
        threadID: string = "",
        fileName: string = "",
        lineNumber: number = 0,
        methodName: string = "",
        text: string = "",
    ) {
        this.id = id;
        this.rawString = rawString;
        this.timestamp = timestamp;
        this.level = level;
        this.threadID = threadID;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.methodName = methodName;
        this.text = text;
    }
}