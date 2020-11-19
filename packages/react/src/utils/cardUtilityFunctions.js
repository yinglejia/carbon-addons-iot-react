import React, { useMemo, useState } from 'react';
import warning from 'warning';
import isNil from 'lodash/isNil';
import mapValues from 'lodash/mapValues';

import { CARD_SIZES } from '../constants/LayoutConstants';

/**
 * determine time range from drop down action
 * range - requested range from card dropdown action
 */
export const determineCardRange = (range) => {
  switch (range) {
    case 'last24Hours':
      return { interval: 'day', count: -1, timeGrain: 'hour', type: 'rolling' };
    case 'last7Days':
      return { interval: 'week', count: -1, timeGrain: 'day', type: 'rolling' };
    case 'lastMonth':
      return {
        interval: 'month',
        count: -1,
        timeGrain: 'day',
        type: 'rolling',
      };
    case 'lastQuarter':
      return {
        interval: 'quarter',
        count: -1,
        timeGrain: 'month',
        type: 'rolling',
      };
    case 'lastYear':
      return {
        interval: 'year',
        count: -1,
        timeGrain: 'month',
        type: 'rolling',
      };
    case 'thisWeek':
      return {
        interval: 'week',
        count: -1,
        timeGrain: 'day',
        type: 'periodToDate',
      };
    case 'thisMonth':
      return {
        interval: 'month',
        count: -1,
        timeGrain: 'day',
        type: 'periodToDate',
      };
    case 'thisQuarter':
      return {
        interval: 'quarter',
        count: -1,
        timeGrain: 'month',
        type: 'periodToDate',
      };
    case 'thisYear':
      return {
        interval: 'year',
        count: -1,
        timeGrain: 'month',
        type: 'periodToDate',
      };
    default:
      return { interval: 'day', count: -5, timeGrain: 'day', type: 'rolling' };
  }
};

/** Compare grains to decide which is greater */
export const compareGrains = (grain1, grain2) => {
  const greaterGrains = {
    hour: ['day', 'week', 'month', 'year'],
    day: ['week', 'month', 'year'],
    week: ['month', 'year'],
    month: ['year'],
    year: [],
  };
  if (grain1 === grain2) {
    return 0;
  }

  if (!grain1 || greaterGrains[grain1].includes(grain2)) {
    return -1;
  }
  return 1;
};

/** Determine the max value card attribute count */
export const determineMaxValueCardAttributeCount = (size, currentAttributeCount) => {
  let attributeCount = currentAttributeCount;
  switch (size) {
    case CARD_SIZES.SMALL:
      attributeCount = 1;
      break;
    case CARD_SIZES.SMALLWIDE:
      attributeCount = 2;
      break;
    case CARD_SIZES.MEDIUMTHIN:
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.MEDIUMWIDE:
      attributeCount = 3;
      break;
    case CARD_SIZES.LARGE:
      attributeCount = 5;
      break;
    case CARD_SIZES.LARGETHIN:
    case CARD_SIZES.LARGEWIDE:
      attributeCount = 7;
      break;
    default:
  }
  return attributeCount;
};

export const getUpdatedCardSize = (oldSize) => {
  const changedSize =
    oldSize === 'XSMALL'
      ? 'SMALL'
      : oldSize === 'XSMALLWIDE'
      ? 'SMALLWIDE'
      : oldSize === 'WIDE'
      ? 'MEDIUMWIDE'
      : oldSize === 'TALL'
      ? 'LARGETHIN'
      : oldSize === 'XLARGE'
      ? 'LARGEWIDE'
      : null;
  let newSize = oldSize;
  if (changedSize) {
    if (__DEV__) {
      warning(
        false,
        `You have set your card to a ${oldSize} size. This size name is deprecated. The card will be displayed as a ${changedSize} size.`
      );
    }
    newSize = changedSize;
  }
  return newSize;
};

/**
 * This function provides common value formatting across all card types
 * @param {number} value, the value the card will display
 * @param {number} precision, how many decimal values to display configured at the attribute level
 * @param {string} locale, the local browser locale because locales use different decimal separators
 */
export const formatNumberWithPrecision = (value, precision = 0, locale = 'en') => {
  return value > 1000000000000
    ? `${(value / 1000000000000).toLocaleString(
        locale,
        !isNil(precision)
          ? {
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }
          : undefined
      )}T`
    : value > 1000000000
    ? `${(value / 1000000000).toLocaleString(
        locale,
        !isNil(precision)
          ? {
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }
          : undefined
      )}B`
    : value > 1000000
    ? `${(value / 1000000).toLocaleString(
        locale,
        !isNil(precision)
          ? {
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }
          : undefined
      )}M`
    : value > 1000
    ? `${(value / 1000).toLocaleString(
        locale,
        !isNil(precision)
          ? {
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }
          : undefined
      )}K`
    : value.toLocaleString(
        locale,
        !isNil(precision)
          ? {
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }
          : undefined
      );
};

/**
 * Reusable function to check if a string contains variables identified by surrounding curly braces i.e. {deviceid}
 * @param {string} value A string with variables, i.e. `{manufacturer} acceleration over the last {sensor} hours`
 * @returns {Array<String>} an array of variables, i.e. ['manufacturer', 'sensor']
 */
export const getVariables = (value) => {
  let variables = value && typeof value === 'string' ? value.match(/{[a-zA-Z0-9_-]+}/g) : null;
  variables = variables?.map((variable) => variable.replace(/[{}]/g, ''));
  return variables;
};

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {Array<String>} variables an array of variable strings
 * @param {object} cardVariables an object with properties such that the key is a variable name and the value is the value to replace it with, i.e. { manufacturer: 'Rentech', sensor: 3 }
 * @param {Object || Array || String} target a card or string to replace variables on
 * @returns {Object} a parsed object with all variables replaced with their corresponding values found on the values object
 */
export const replaceVariables = (variables, cardVariables, target) => {
  // Need to create a copy of cardVariables with all lower-case keys
  const insensitiveCardVariables = Object.keys(cardVariables).reduce((acc, variable) => {
    acc[variable.toLowerCase()] = cardVariables[variable];
    return acc;
  }, {});

  // if it's an array then recursively place the variables in each element
  if (Array.isArray(target)) {
    return target.map((element) => replaceVariables(variables, cardVariables, element));
  }

  // if it's an object, then recursively replace each value unless it's a react element
  if (typeof target === 'object') {
    // if it's a react element, leave it alone
    return React.isValidElement(target)
      ? target
      : mapValues(target, (property) =>
          replaceVariables(variables, insensitiveCardVariables, property)
        );
  }

  // we can only replace on string targets at this point
  if (typeof target !== 'string') {
    return target;
  }
  let updatedTarget = target;
  variables.forEach((variable) => {
    const insensitiveVariable = variable.toLowerCase();
    const variableRegex = new RegExp(`{${variable}}`, 'g');
    const exactMatch = new RegExp(`^{${insensitiveVariable}}$`, 'g');
    // if we're an exact match on number then set to number (to support numeric thresholds)
    if (
      exactMatch.test(target) &&
      typeof insensitiveCardVariables[insensitiveVariable] === 'number'
    ) {
      updatedTarget = insensitiveCardVariables[insensitiveVariable];
    } else if (typeof insensitiveCardVariables[insensitiveVariable] === 'function') {
      const callback = insensitiveCardVariables[insensitiveVariable];
      updatedTarget = callback(variable, target);
    } else {
      // if the target is still a string then continue
      updatedTarget =
        typeof updatedTarget === 'string' && !isNil(insensitiveCardVariables[insensitiveVariable])
          ? updatedTarget.replace(variableRegex, insensitiveCardVariables[insensitiveVariable])
          : updatedTarget;
    }
  });
  return updatedTarget;
};

/**
 * @param {Object} cardProperty
 * @returns {Array<String>} an array of unique variable values
 */
export const getCardVariables = (cardProperty) => {
  const propertyVariables = Object.values(cardProperty).reduce((acc, property) => {
    if (typeof property === 'object' && !React.isValidElement(property) && !isNil(property)) {
      // recursively search any objects for additional string properties
      acc.push(...getCardVariables(property));
    } else if (typeof property === 'string') {
      // if it's a string, look for variables
      const detectedVariables = getVariables(property);
      if (detectedVariables) {
        acc.push(...detectedVariables);
      }
    }
    return acc;
  }, []);
  return [...new Set(propertyVariables)];
};

/**
 * Replace variables from the list of variables that are found on the target with their corresponding value
 * @param {string} title - Title for the card
 * @param {object} content - Contents for the card
 * @param {string} values - Values for the card
 * @param {object} card - The rest of the card
 * @return {object} updatedCard - card with any found variables replaced by their coresponding values, or the original card if no variables
 */
export const handleCardVariables = (title, content, values, card) => {
  const updatedCard = {
    title,
    content,
    values,
    ...card,
  };
  if (!updatedCard.cardVariables) {
    return updatedCard;
  }
  const { cardVariables } = updatedCard;

  const variablesArray = getCardVariables(updatedCard);

  return replaceVariables(variablesArray, cardVariables, updatedCard);
};

/**
 * This function provides common value formatting across all chart card types
 * @param {number} value, the value the card will display
 * @param {number} precision, how many decimal values to display configured at the attribute level
 * @param {string} locale, the local browser locale because locales use different decimal separators
 */
export const formatChartNumberWithPrecision = (value, precision = 0, locale = 'en') => {
  return value.toLocaleString(
    locale,
    !isNil(precision)
      ? {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }
      : undefined
  );
};

/**
 * Determines how many decimals to show for a value based on the value, the available size of the card
 * @param {string} size constant that describes the size of the Table card
 * @param {any} value will be checked to determine how many decimals to show
 * @param {*} precision Desired decimal precision, will be used if specified
 */
export const determinePrecision = (size, value, precision) => {
  // If it's an integer don't return extra values
  if (Number.isInteger(value)) {
    return 0;
  }
  // If the card is xsmall we don't have room for decimals!
  switch (size) {
    case CARD_SIZES.SMALL:
      return !isNil(precision) ? precision : Math.abs(value) > 9 ? 0 : undefined;
    default:
  }
  return precision;
};

/**
 * Determines how to format our values for our lines and bars
 *
 * @param {any} value any value possible, but will only special format if a number
 * @param {string} size card size
 * @param {string} unit any optional units to show
 */
export const chartValueFormatter = (value, size, unit, locale) => {
  const precision = determinePrecision(size, value, Math.abs(value) > 1 ? 1 : 3);
  let renderValue = value;
  if (typeof value === 'number') {
    renderValue = formatChartNumberWithPrecision(value, precision, locale);
  } else if (isNil(value)) {
    renderValue = '--';
  }
  return `${renderValue}${!isNil(unit) ? ` ${unit}` : ''}`;
};

/**
 * Charts render incorrectly if size is too small, so change their size to MEDIUM
 * @param {string} size card size
 */
export const increaseSmallCardSize = (size, cardName) => {
  if (__DEV__) {
    warning(
      size !== CARD_SIZES.SMALL && size !== CARD_SIZES.SMALLWIDE,
      `${cardName} does not support card size ${size}`
    );
  }
  return size === CARD_SIZES.SMALL
    ? CARD_SIZES.MEDIUM
    : size === CARD_SIZES.SMALLWIDE
    ? CARD_SIZES.MEDIUMWIDE
    : size;
};

const resizeHandleId = 'resizableHandle';

/**
 * Simple helper function to extract the resizeHandles from the react children
 * @param {} children the react children data structure containing the resizeHandles
 */
export const getResizeHandles = (children) =>
  React.Children.toArray(children).filter((child) => child.key?.includes(resizeHandleId));

/**
 * Custom hook that manages the isResizable state. It does that by wrapping
 * the onStart/onStop callbacks found in the resizeHandles. The resizeHandles
 * are created by the external library react-grid-layout.
 *
 * The hook returns an object with both the modified resizeHandles and
 * the isResizing state.
 *
 * @param {array} wrappingCardResizeHandles resizeHandles optionally passed down by wrapping card
 * @param {} children the react children data structure containing the resizeHandles
 * @param {boolean} isResizable true if the component using the hook should be resizable
 */
export const useCardResizing = (wrappingCardResizeHandles, children, isResizable) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeHandlesWithEventHandling = useMemo(
    () => {
      const resizeHandles =
        wrappingCardResizeHandles || (isResizable && getResizeHandles(children)) || [];

      return resizeHandles.map((handleElement) =>
        React.cloneElement(handleElement, {
          ...handleElement.props,
          onStart: (...args) => {
            setIsResizing(true);
            if (handleElement.props?.onStart) {
              handleElement.props.onStart(...args);
            }
          },
          onStop: (...args) => {
            setIsResizing(false);
            if (handleElement.props?.onStop) {
              handleElement.props.onStop(...args);
            }
          },
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isResizable]
  );
  return { resizeHandles: resizeHandlesWithEventHandling, isResizing };
};

/**
 *
 * @param {string} url the url where the image is hosted
 * @param {function} callback for handling errors from fetch
 */
export const fetchDataURL = (url, callback) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.arrayBuffer();
    })
    .then((ab) => ({
      files: {
        addedFiles: [new File([ab], `${url.match(/([^/]*?)(?=\?|#|$)/)[0]}`)],
      },
      dataURL: `data:image/png;base64,${btoa(
        new Uint8Array(ab).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )}`,
    }))
    .catch((e) => callback(e.message));
