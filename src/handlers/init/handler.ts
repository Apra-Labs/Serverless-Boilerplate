// import { createS3Bucket } from "../../utils/s3";
// import { Init } from "../init/interface";
// import { createTableIfNotExists } from "../../utils/dynamoDB";
// import { getCommonAPIResponseByData, getCommonAPIResponseByError } from "../../utils/commonUtils";



// export const doInit = async () => {
//     try {
//         const param: Init = { tables: [process.env.userTable] };
//         for (let i = 0; i < param.tables.length; i++) {
//             const table = param.tables[i];
//             console.log("table init: ", table);
//             await createTableIfNotExists(table);
//         }
//         console.log("table init success");
//         try {
//             await createS3Bucket(process.env.mediaBucketName, true);
//             console.log("s3 bucket created:" + process.env.mediaBucketName);
//         } catch (err) {
//             if (err.code == "BucketAlreadyOwnedByYou") {
//                 console.log("s3 bucket already exists:" + process.env.mediaBucketName);
//             } else {
//                 console.error(err);
//             }
//         }
//         return getCommonAPIResponseByData({ success: true });
//     } catch (err) {
//         console.error("init failed");
//         throw getCommonAPIResponseByError(err);
//     }
// }