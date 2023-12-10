import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFile } from "fs";
import { join } from "path";

@Injectable()
export class FileService {

    async upload(file: Express.Multer.File) {
        return await writeFile(file.path, file.buffer, () => { });
    }

    generateSavePath(saveDirectory: string, originalname: string) {
        let path: string;
        let newName: string

        const extension = "." + this.getExtension(originalname)
        let fileName = originalname
    
        const indexOfSearchString = fileName.indexOf(extension);

        if (indexOfSearchString !== -1) {
            fileName = fileName.substring(0, indexOfSearchString);
        }

        console.log(fileName)
        this.createDirectoryIfNotExists(saveDirectory)

        let counter = 0;

        do {
            newName = fileName + (counter > 0 ? `(${counter})` : '') + extension
            path = join(saveDirectory, newName)
            counter++;
        } while (existsSync(path))

        return path;
    }

    getExtension(fileName: string) {
        if (fileName == null || fileName == "") {
            return ""
        }
        const fileNameParts = fileName.split('.')
        return fileNameParts[fileNameParts.length - 1]
    }

    createDirectoryIfNotExists(directoryPath: string): void {
        if (!existsSync(directoryPath)) {
            mkdirSync(directoryPath, { recursive: true });
        }
    }
}