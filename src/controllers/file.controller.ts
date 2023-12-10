import {Request, Response} from "express";
import {UploadedFile} from "express-fileupload";

export class FileController {
  static async uploadImage(req: Request, res: Response) {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }

    const image = req.files.img as UploadedFile;

    if (image.mimetype != "image/png") {
        return res.status(500).send({ msg: "invalid image format" })
    }

    image.mv(`./static/images/${image.name}`,
        function (err: string) {
            if (err) {
                console.log(err)
                return res.status(500).send({ msg: "Error occurred" })
            }

            return res.send({name: image.name, path: `/${image.name}`});
        })
  }
}
