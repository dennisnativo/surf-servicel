import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

import { ISerCelResponse } from '../interfaces/ServCel'

class ServCelController {
  public static async index (req: Request, res: Response, next: NextFunction) {
    const statusCode: number = 200
    const response: ISerCelResponse = {
      codResposta: ''
    }

    console.log(req)

    res.status(statusCode).json({ OK: true })

    return next()

    // const schema = Yup.object().shape({
    //   msisdn: Yup.string().required('MSISDN é obrigatório')
    // })

    // schema.validate(req.body)
    //   .then(async (body: any) => {
    //     req.body.objRes = {
    //       statusCode,
    //       response
    //     }

    //     res.status(statusCode).json(response)

    //     return next()
    //   })
    //   .catch((err: any) => {
    //     statusCode = 400
    //     response.codResposta = '10'
    //     console.log(err)

    //     req.body.objRes = {
    //       statusCode,
    //       response
    //     }

    //     res.status(statusCode).json(response)

    //     return next()
    //   })
  }
}

export default ServCelController
