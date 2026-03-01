export class BadRequestError extends Error {
  statusCode = 400;
}

export class RenderError extends Error {
  statusCode = 500;
}