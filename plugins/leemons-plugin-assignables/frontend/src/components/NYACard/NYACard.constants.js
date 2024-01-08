import PropTypes from 'prop-types';

export const NYACARD_PROP_TYPES = {
  instance: PropTypes.object,
  showSubject: PropTypes.bool,
  labels: PropTypes.object,
  classData: PropTypes.array,
  clickable: PropTypes.bool,
};

export const NYACARD_DEFAULT_PROPS = {
  instance: {},
  showSubject: false,
  labels: {},
  classData: [],
  clickable: true,
};
