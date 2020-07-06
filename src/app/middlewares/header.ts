import { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.header = {
      project: 'ServCel'
    }

    return next()
  } catch (err) {
    console.log(err)
    res.status(401).json({ error: 'Internal Server Error.' })
  }
}
