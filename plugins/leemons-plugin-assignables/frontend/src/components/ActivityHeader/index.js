/* eslint-disable consistent-return */
import { Box, ImageLoader, TotalLayoutHeader } from '@bubbles-ui/components';
import React, { useMemo } from 'react';
import { FormProvider } from 'react-hook-form';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import ActivityTypeDisplay from './components/ActivityTypeDisplay/ActivityTypeDisplay';
import CalificationTypeDisplay from './components/CalificationTypeDisplay/CalificationTypeDisplay';
import DateComponent from './components/Date/Date';
import Timer from './components/Timer/Timer';
import ClassroomDisplay from './components/ClassroomDisplay/ClassroomDisplay';
import useTotalLayoutStyles from './TotalLayout.style';
import CloseButtons from './components/CloseButtons/CloseButtons';
import {
  ACTIVIY_HEADER_PROP_TYPES,
  ACTIVIY_HEADER_DEFAULT_PROPS,
} from './ActivityHeader.constants';

export default function ActivityHeader({
  instance,
  action,
  showClass,
  showRole,
  showEvaluationType,
  showTime,
  showDeadline,
  showCloseButtons,
  allowEditDeadline,
}) {
  /*
    === Activity data ===
  */
  const assignable = instance?.assignable;

  const isModule = !!instance?.metadata?.module;
  const isModuleActivity = !!isModule && instance?.metadata?.module?.type !== 'module';

  const { data } = useInstances({ id: instance?.metadata?.module?.id, enabled: isModuleActivity });

  /*
    === Asset data ===
  */
  const preparedAsset = prepareAsset(assignable?.asset ?? {});
  const coverUrl = preparedAsset?.cover;

  /*
    === Presentation ===
  */
  const title = useMemo(() => {
    if (action) {
      return action;
    }

    if (isModuleActivity) {
      return data?.assignable?.asset?.name;
    }

    return assignable?.asset?.name;
  }, [action, assignable?.asset?.name, data?.assignable?.asset?.name, isModuleActivity]);

  const subtitle = useMemo(() => {
    if (action || isModuleActivity) {
      return assignable?.asset?.name;
    }
  }, [action, isModuleActivity, assignable?.asset?.name]);

  const { classes } = useTotalLayoutStyles();

  return (
    <FormProvider {...form}>
      <TotalLayoutHeader
        title={title}
        formTitlePlaceholder={subtitle}
        iconLarge
        icon={
          <Box
            sx={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <ImageLoader
              src={coverUrl ?? assignable?.roleDetails?.icon}
              width={40}
              height={40}
              imageStyles={{ borderRadius: 4 }}
            />
          </Box>
        }
        direction="row"
        cancelable={false}
      >
        <Box className={classes.root}>
          <ClassroomDisplay instance={instance} hidden={!showClass} />
          <Box className={classes.activityMetadata}>
            <ActivityTypeDisplay assignable={assignable} hidden={!showRole} />
            <CalificationTypeDisplay assignable={assignable} hidden={!showEvaluationType} />
            <Timer instance={instance} hidden={!showTime} />
            <DateComponent
              instance={instance}
              hidden={!showDeadline}
              allowEdit={!!allowEditDeadline}
            />
          </Box>
          <CloseButtons instance={instance} hidden={!showCloseButtons} />
        </Box>
      </TotalLayoutHeader>
    </FormProvider>
  );
}

ActivityHeader.propTypes = ACTIVIY_HEADER_PROP_TYPES;
ActivityHeader.defaultProps = ACTIVIY_HEADER_DEFAULT_PROPS;
ActivityHeader.displayName = 'ActivityHeader';
