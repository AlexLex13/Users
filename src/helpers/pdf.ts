import {User} from "../entities/user.entity";
import { PDFDocument } from 'pdf-lib'
import * as fs from "fs";

export class pdf {
    static async createPDF(user: User) {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage()

        page.drawText(`${user.firstName} ${user.lastName}`)

        if(user.image){
            try {
                const imageBytes = fs.readFileSync(`./static/images/${user.image}`)
                const imagePDF = await pdfDoc.embedPng(imageBytes)

                page.drawImage(imagePDF)
            } catch (err) {
                console.error(err);
                return
            }
        }

        return await pdfDoc.save()
    }
}