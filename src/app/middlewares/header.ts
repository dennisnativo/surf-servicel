import { Request, Response, NextFunction } from 'express'

export default async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    req.payload = {
      project: 'ServCel'
    }

    return next()
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: 'Internal Server Error.' })
  }
}
