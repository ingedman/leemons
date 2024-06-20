import { ContextContainer, Select, TableInput, UserDisplayItem } from '@bubbles-ui/components';
import SelectUserAgent from '@users/components/SelectUserAgent';
import _, { find, isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const SelectAgents = ({ usersData, onlyForTeachers, teacherProfile, ...props }) => (
  <SelectUserAgent
    {...props}
    onlyContacts={true}
    profiles={teacherProfile}
    onlyForTeachers={onlyForTeachers}
    selectedUsers={_.map(usersData, 'user.id')}
    returnItem
  />
);

SelectAgents.propTypes = {
  usersData: PropTypes.array,
  onlyForTeachers: PropTypes.bool,
  teacherProfile: PropTypes.object,
};

const RoleSelect = (props) => {
  if (!props.value) {
    props.onChange('viewer');
  }
  return <Select {...props} />;
};

// add prop types
RoleSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

const PermissionsDataUsers = ({
  editMode,
  roles,
  value,
  onChange,
  alreadySelectedUsers,
  t,
  onlyForTeachers,
  teacherProfile,
}) => {
  // ··············································································
  // HANDLERS
  const checkIfUserIsAdded = (userData) => {
    const found = find(value, (data) => data.user.id === userData.user.id);
    return isNil(found);
  };

  // ··············································································
  // LABELS & STATICS
  const USERS_COLUMNS = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user',
        input: {
          node: (
            <SelectAgents
              onlyForTeachers={onlyForTeachers}
              teacherProfile={teacherProfile}
              usersData={[...alreadySelectedUsers, ...value]}
            />
          ),
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (val) => <UserDisplayItem {...val} variant="inline" size="xs" />,
        style: { width: '60%' },
      },
      {
        Header: 'Role',
        accessor: 'role',
        editable: false,
        input: {
          node: <RoleSelect />,
          rules: { required: 'Required field' },
          data: roles,
        },
        valueRender: (val) => find(roles, { value: val })?.label,
      },
    ],
    [roles, value]
  );

  const USER_LABELS = useMemo(
    () => ({
      // add: t('permissionsData.labels.addUserButton', 'Add'),
      remove: t('permissionsData.labels.removeUserButton', 'Remove'),
      // edit: t('permissionsData.labels.editUserButton', 'Edit'),
      // accept: t('permissionsData.labels.acceptButton', 'Accept'),
      // cancel: t('permissionsData.labels.cancelButton', 'Cancel'),
    }),
    [t]
  );

  // ··············································································
  // RENDER

  return (
    <ContextContainer padded={false} spacing={0}>
      {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={onChange}
          columns={USERS_COLUMNS}
          labels={USER_LABELS}
          showHeaders={false}
          sortable={false}
          forceShowInputs={!editMode}
          editable={!editMode}
          removable={true}
          onBeforeAdd={checkIfUserIsAdded}
          resetOnAdd
          unique
        />
      )}
    </ContextContainer>
  );
};

PermissionsDataUsers.propTypes = {
  roles: PropTypes.any,
  userRole: PropTypes.string,
  asset: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  t: PropTypes.func,
  translations: PropTypes.object,
  editMode: PropTypes.bool,
  alreadySelectedUsers: PropTypes.any,
  onlyForTeachers: PropTypes.bool,
  teacherProfile: PropTypes.string,
};

export default PermissionsDataUsers;
export { PermissionsDataUsers };
