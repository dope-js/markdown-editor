import { isFunction, isNumber, isString } from '@/utils';

export function handleTruncateValue(value: string, maxLength: number, getValueLength?: (value: string) => number) {
  if (isFunction(getValueLength)) {
    let truncatedValue = '';
    for (let i = 1, len = value.length; i <= len; i++) {
      const currentValue = value.slice(0, i);
      if (getValueLength(currentValue) > maxLength) {
        return truncatedValue;
      } else {
        truncatedValue = currentValue;
      }
    }
    return truncatedValue;
  } else {
    return value.slice(0, maxLength);
  }
}

export function handleVisibleMaxLength(value: string, maxLength?: number, getValueLength?: (value: string) => number) {
  if (isNumber(maxLength) && maxLength >= 0 && isFunction(getValueLength) && isString(value)) {
    const valueLength = getValueLength(value);
    if (valueLength > maxLength) {
      console.warn(
        '[TextArea] The input character is truncated because the input length exceeds the maximum length limit'
      );
      const truncatedValue = handleTruncateValue(value, maxLength);
      return truncatedValue;
    } else {
      return value;
    }
  }

  return '';
}
