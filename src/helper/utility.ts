import moment, { isMoment, Moment } from 'moment';
import { DATE_FORMAT } from '../constant/app';

export const memoize = (fn = (...args: Array<any>) => null) => {
  let lastArgs: Array<any> = [];
  let lastResult: any = null;
  let called = false;

  function memoized(...args: Array<any>) {
    const newArgs = [];

    for (let _i = 0; _i < args.length; _i++) {
      newArgs[_i] = args[_i];
    }

    if (called && newArgs == lastArgs) {
      return lastResult;
    }

    lastResult = fn.apply(window, newArgs);
    called = true;
    lastArgs = newArgs;
    return lastResult;
  }
  return memoized;
}

export const decodeHTMLTags = (str = "") => {
  const htmlTagRegex = /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi
  const entities = {
    'amp': '&',
    'apos': '\'',
    '#x27': '\'',
    '#x2F': '/',
    '#39': '\'',
    '#47': '/',
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'quot': '"',
  }

  return str.replace(htmlTagRegex, '').replace(/&([^;]+);/gm, (match, entity: keyof typeof entities) => entities[entity] || match)
}



export const getCalendarDate = (date: Date | Moment) => {
  return moment(date).calendar({
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'DD MMM',
  })
};


export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const getProfileSrc = (profile_url = "") => {
  if (profile_url) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${profile_url}`;
  }
  return "";
}

const appendArray = (formData: FormData, key: string | number, arrValue: Array<any>) => {
  arrValue.forEach((value, index) => {
    if (isMoment(value)) {
      return formData.append(`${key}[${index}]`, value.format(DATE_FORMAT));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${key}[${index}]`, value);
    }

    if (value instanceof File) {
      return formData.append(`${key}[${index}]`, value, value.name);
    }

    if (value !== null && typeof value === typeof {}) {
      return appendObject(formData, `${key}[${index}]`, value);
    }

    formData.append(`${key}[${index}]`, value);
  });
};

const appendObject = (formData: FormData, mainKey: string | number, obj: any) => {
  Object.keys(obj).forEach((key, index) => {
    const value: any = obj[key];
    if (isMoment(value)) {
      return formData.append(`${mainKey}[${key}]`, value.format(DATE_FORMAT));
    }

    if (value instanceof Array) {
      return appendArray(formData, `${mainKey}[${key}]`, value);
    }

    if (value instanceof File) {
      return formData.append(`${mainKey}[${key}]`, value, value.name);
    }

    if (value !== null && typeof value === typeof {}) {
      return appendObject(formData, `${mainKey}[${key}]`, value);
    }

    formData.append(`${mainKey}[${key}]`, value);
  });
};

export const getFormData = (obj: any = {}) => {
  const formData = new FormData();
  for (const key in obj) {
    if (isMoment(obj[key])) {
      formData.append(key, obj[key].format(DATE_FORMAT));
      continue;
    }

    if (obj[key] instanceof Array) {
      appendArray(formData, key, obj[key]);
      continue;
    }

    if (obj[key] instanceof File) {
      formData.append(key, obj[key]);
      continue;
    }

    if (obj[key] !== null && typeof obj[key] === typeof {}) {
      appendObject(formData, key, obj[key]);
      continue;
    }

    formData.append(key, obj[key]);
  }
  return formData;
}

export const getExtention = (name:string)=> {
  const length = name?.split(".").length
  const extension = name.split(".")[length-1]
  return extension
}

export const flattenObject = (obj: { [key in string]: any }, prefix = '', key?: string) =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix : '';
    if (key && typeof obj[key] === 'object') {
      Object.assign(acc, flattenObject(obj[k], pre, key));
    }
    else if (!key && typeof obj[k] === 'object') {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    }
    else {
      acc[pre + k] = obj[k]
    }
    return acc;
  }, {} as { [key in string]: any });


export const keyBy = <T = any>(arr: Array<T>, key = "id") => {
  if(!arr || !arr.length) return null;

  return arr.reduce((result, item: any) => {
    result[item[key]] = item;
    return result;
  }, {} as {[k in typeof key]: T})
}


export const isBrowser = () => typeof window !== 'undefined' && window.document !== undefined;
export const toKebabCase = (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || ""
export const toSnakeCase = (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || ""
