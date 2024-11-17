export const allSettledRequest = async <T>(promises: Promise<T>[]) => {
  try {
    let data = [] as T[];
    let errors = [] as PromiseRejectedResult['reason'][];

    await Promise.allSettled(promises).then(results => {
      data = results
        .filter(val => val.status === 'fulfilled')
        .map(val => (<PromiseFulfilledResult<T>>val).value);
      errors = results.filter(c => c.status === 'rejected').map(c => (<PromiseRejectedResult>c).reason);
    });
    return { data, errors };
  } catch (error) {
    throw Error((<Error>error).message);
  }
};
