import { read, utils } from "xlsx";
import { parse } from "papaparse";

type BulkRow = {
  from: string;
  to: string;
  message: string;
};

const createBulkArray = async (file: File) => {
  if (!file) return;
  const extension = file?.name?.split(".")?.pop()?.toLowerCase();
  if (extension === "csv") {
    return new Promise((resolve, reject) => {
      parse<BulkRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => reject(error),
      });
    });
  }
  if (extension === "xlsx") {
    const data = await file.arrayBuffer();
    const readFile = read(data, { type: "buffer" });
    const sheetName = readFile.SheetNames[0];
    const worksheet = readFile.Sheets[sheetName];
    const rawResult = utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    const result = rawResult.slice(1).map((item) => {
      return {
        from: item[0],
        to: item[1],
        message: item[2],
      };
    });
    return result;
  }
};

export default createBulkArray;
