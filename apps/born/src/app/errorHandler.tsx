export const errorHandler = (error: Error, info: {componentStack: string}) => {
  // Do something with the error
  // E.g. log to an error logging client here

  console.log({WeCantStopIT: error})
}
