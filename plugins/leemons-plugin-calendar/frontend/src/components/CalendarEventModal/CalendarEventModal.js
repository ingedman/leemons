import React from 'react';
import PropTypes from 'prop-types';
import { get, isArray, isFunction, isNil, keyBy, map } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Text,
  Button,
  Drawer,
  Select,
  TextInput,
  RadioGroup,
  ActionButton,
  ContextContainer,
} from '@bubbles-ui/components';
import { EditWriteIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { Dates } from './components/Dates';
import { CalendarEventModalStyles } from './CalendarEventModal.styles';
import { useIsTeacher } from '@academic-portfolio/hooks';

const REQUIRED_FIELD = 'Field is required';
const CALENDAR_TYPES = {
  EVENT: 'calendar.event',
  TASK: 'calendar.task',
};

export const CALENDAR_EVENT_MODAL_DEFAULT_PROPS = {
  opened: false,
  readOnly: false,
  onClose: () => {},
  onRemove: () => {},
  onSubmit: () => {},
  selectData: {
    repeat: [
      { label: "Don't repeat", value: 'dont_repeat' },
      { label: 'Every day', value: 'every_day' },
      { label: 'Every week', value: 'every_week' },
      { label: 'Every month', value: 'every_month' },
      { label: 'Every year', value: 'every_year' },
    ],
    calendars: [],
    eventTypes: [],
  },
  messages: {
    newEvent: 'New event',
    newTask: 'New task',
    fromLabel: 'From',
    toLabel: 'To',
    repeatLabel: 'Repeat',
    allDayLabel: 'All day',
    titlePlaceholder: 'Event title',
    cancelButtonLabel: 'Cancel',
    saveButtonLabel: 'Save',
    updateButtonLabel: 'Update',
    calendarPlaceholder: 'Select calendar',
    calendarLabel: 'Choose calendar where to display',
    showInCalendar: 'Show in calendar',
  },
  errorMessages: {
    titleRequired: REQUIRED_FIELD,
    startDateRequired: REQUIRED_FIELD,
    startTimeRequired: REQUIRED_FIELD,
    endDateRequired: REQUIRED_FIELD,
    endTimeRequired: REQUIRED_FIELD,
    calendarRequired: REQUIRED_FIELD,
    typeRequired: REQUIRED_FIELD,
  },
};
export const CALENDAR_EVENT_MODAL_PROP_TYPES = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onRemove: PropTypes.func,
  selectData: PropTypes.object,
  forceType: PropTypes.string,
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  components: PropTypes.object,
  isNew: PropTypes.bool,
  isOwner: PropTypes.bool,
  fromCalendar: PropTypes.string,
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  readOnly: PropTypes.bool,
  locale: PropTypes.string,
  UsersComponent: PropTypes.any,
  form: PropTypes.object,
};

function MyController(props) {
  return <Controller {...props} name={`data.${props.name}`} />;
}

MyController.propTypes = {
  name: PropTypes.string,
};

function CalendarEventModal(props) {
  const {
    opened,
    onClose,
    onRemove,
    selectData,
    forceType,
    messages,
    errorMessages,
    components,
    isNew,
    isOwner,
    fromCalendar,
    onSubmit,
    defaultValues,
    readOnly,
    locale,
    UsersComponent,
    form: formProp,
  } = props;

  const [canEdit, setCanEdit] = React.useState(false);
  const { classes, cx } = CalendarEventModalStyles({});
  const isTask = defaultValues?.type === CALENDAR_TYPES.TASK;
  const isTeacher = useIsTeacher();

  if (isTask && isNil(defaultValues?.data?.hideInCalendar)) {
    if (isNil(defaultValues.data)) defaultValues.data = {};
    defaultValues.data.hideInCalendar = true;
  }
  const newForm = useForm({ defaultValues });
  const form = formProp || newForm;
  const {
    watch,
    control,
    trigger,
    register,
    setValue,
    getValues,
    unregister,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = form;

  const calendar = watch('calendar');
  const hideInCalendar = watch('data.hideInCalendar');
  const hideCalendarField = watch('data.hideCalendarField');
  const type = watch('type');
  const eventTypesByValue = keyBy(selectData.eventTypes, 'value');
  const config = eventTypesByValue[type]?.config;
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (value.type === CALENDAR_TYPES.TASK) {
        if (name === 'type') {
          setValue('data.hideInCalendar', true);
        }
        if (
          name === 'data.hideInCalendar' &&
          hideInCalendar &&
          calendar !== selectData.calendars[0]?.value
        ) {
          setValue('calendar', selectData.calendars[0]?.value);
        }
      }
    });
    return () => subscription.unsubscribe();
  });

  let Component = () => null;
  let hasComponent = false;

  if (type && components && components[type]) {
    Component = components[type];
    hasComponent = true;
  }

  let disabled = !isNew || readOnly;
  if (canEdit) disabled = false;

  function onEdit() {
    setCanEdit(true);
  }

  const titleDrawer = () => {
    if (type === CALENDAR_TYPES.TASK) {
      return isNew ? messages.newTask : messages.detailTask;
    }
    return isNew ? messages.newEvent : messages.detailEvent;
  };

  return (
    <Drawer size={'sm'} className={classes.root} onClose={onClose} opened={opened}>
      <Drawer.Header title={titleDrawer()}>
        <Drawer.Header.RightActions>
          <Box>
            {isOwner ? (
              <ActionButton icon={<EditWriteIcon width={18} height={18} />} onClick={onEdit} />
            ) : null}

            {(isTeacher && isTask) || isOwner ? (
              <ActionButton icon={<DeleteBinIcon width={18} height={18} />} onClick={onRemove} />
            ) : null}
          </Box>
        </Drawer.Header.RightActions>
      </Drawer.Header>
      <Drawer.Content>
        <form autoComplete="off">
          <ContextContainer spacing={8}>
            <ContextContainer spacing={4}>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: errorMessages.titleRequired,
                }}
                render={({ field }) => {
                  if (disabled) {
                    return (
                      <>
                        <Text size="lg" strong>
                          {messages.title}
                        </Text>
                        <Text>{field.value}</Text>
                      </>
                    );
                  }
                  return (
                    <TextInput
                      readOnly={disabled}
                      disabled={disabled}
                      label={config?.titleLabel || messages.name}
                      placeholder={config?.titlePlaceholder || messages.titlePlaceholder}
                      error={get(errors, 'title')}
                      required={!disabled}
                      {...field}
                    />
                  );
                }}
              />

              {!forceType ? (
                <ContextContainer spacing={4}>
                  <Controller
                    name="type"
                    control={control}
                    rules={{
                      required: errorMessages.typeRequired,
                    }}
                    render={({ field }) => {
                      if (disabled) {
                        return null;
                      }
                      return (
                        <RadioGroup
                          {...field}
                          disabled={disabled}
                          variant="default"
                          direction={selectData.eventTypes.length < 3 ? 'row' : 'column'}
                          error={get(errors, 'type')}
                          data={selectData.eventTypes}
                          noRootPadding
                        />
                      );
                    }}
                  />
                </ContextContainer>
              ) : null}
            </ContextContainer>

            <ContextContainer spacing={4}>
              <Dates
                {...props}
                form={form}
                classes={classes}
                readOnly={disabled}
                locale={locale}
                disabled={disabled}
                onlyOneDate={false}
                config={config}
              />
            </ContextContainer>

            <ContextContainer spacing={4}>
              <Component
                isEditing={true}
                allFormData={watch()}
                data={watch('data')}
                classes={classes}
                readOnly={disabled}
                disabled={disabled}
                allProps={{ ...props, form }}
                form={{
                  Controller: MyController,
                  control,
                  register: (ref, options) => register(`data.${ref}`, options),
                  setValue: (ref, value, options) => setValue(`data.${ref}`, value, options),
                  getValues: (refs) => {
                    if (isArray(refs)) return getValues(map(refs, (ref) => `data.${ref}`));
                    return getValues(`data.${refs}`);
                  },
                  watch: (refs, options) => {
                    if (isFunction(refs)) {
                      return watch(refs, options);
                    }
                    if (isArray(refs)) {
                      return watch(
                        map(refs, (ref) => `data.${ref}`),
                        options
                      );
                    }
                    return watch(`data.${refs}`, options);
                  },
                  unregister: (refs) => {
                    if (isArray(refs)) return unregister(map(refs, (ref) => `data.${ref}`));
                    return unregister(`data.${refs}`);
                  },
                  trigger: (refs) => {
                    if (isArray(refs)) return trigger(map(refs, (ref) => `data.${ref}`));
                    return trigger(`data.${refs}`);
                  },
                  formState: { errors: errors ? errors.data : {}, isSubmitted },
                }}
              />
            </ContextContainer>

            {!disabled &&
            (isNew || (!isNew && isOwner)) &&
            (type !== CALENDAR_TYPES.TASK || (type === CALENDAR_TYPES.TASK && !hideInCalendar)) ? (
              <ContextContainer spacing={4}>
                <Controller
                  name="calendar"
                  control={control}
                  rules={{
                    required: errorMessages.calendarRequired,
                  }}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      readOnly={disabled}
                      disabled={disabled}
                      label={messages.calendarLabel}
                      placeholder={messages.calendarPlaceholder}
                      {...field}
                      required={!disabled}
                      error={get(errors, 'calendar')}
                      data={selectData.calendars}
                      withinPortal={false}
                    />
                  )}
                />
              </ContextContainer>
            ) : null}

            {!hideCalendarField && disabled ? (
              <ContextContainer spacing={2}>
                <Text size="lg" strong>
                  {messages.calendarLabelDisabled}
                </Text>
                <Controller
                  name="calendar"
                  control={control}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      readOnly={disabled}
                      disabled={disabled}
                      {...field}
                      required={!disabled}
                      error={get(errors, 'calendar')}
                      data={selectData.calendars}
                      withinPortal={false}
                    />
                  )}
                />
              </ContextContainer>
            ) : null}

            {UsersComponent && !disabled ? (
              <ContextContainer spacing={4}>
                <Controller
                  name="users"
                  control={control}
                  render={({ field }) =>
                    React.cloneElement(UsersComponent, {
                      ...field,
                      readOnly: disabled,
                      disabled,
                    })
                  }
                />
              </ContextContainer>
            ) : null}
            {disabled && form.getValues('users')?.length ? (
              <ContextContainer spacing={2}>
                <Text size="lg" strong>
                  {messages.usersDisabled}
                </Text>
                <Controller
                  name="users"
                  control={control}
                  render={({ field }) =>
                    React.cloneElement(UsersComponent, {
                      ...field,
                      readOnly: disabled,
                      disabled,
                    })
                  }
                />
              </ContextContainer>
            ) : null}
          </ContextContainer>
        </form>
      </Drawer.Content>
      <Drawer.Footer>
        {!disabled ? (
          <Box className={classes.actionButtonsContainer}>
            <Button type="button" variant="light" compact onClick={onClose}>
              {messages.cancelButtonLabel}
            </Button>
            {isNew ? (
              <Button onClick={handleSubmit(onSubmit)} type="button">
                {messages.saveButtonLabel}
              </Button>
            ) : null}
            {!isNew && isOwner ? (
              <Button onClick={handleSubmit(onSubmit)} type="button">
                {messages.updateButtonLabel}
              </Button>
            ) : null}
          </Box>
        ) : null}
      </Drawer.Footer>
    </Drawer>
  );
}

CalendarEventModal.defaultProps = CALENDAR_EVENT_MODAL_DEFAULT_PROPS;
CalendarEventModal.propTypes = CALENDAR_EVENT_MODAL_PROP_TYPES;

export { CalendarEventModal };
