import { Request, Response, NextFunction } from 'express'

export default async (req: Request | any, res: Response, next: NextFunction) => {
  req.payload = {
    project: 'ServCel'
  }

  return next()
}
