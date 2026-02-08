import { useState } from 'react';
import DateRangePicker from './filters/DateRangePicker'
import MultiSelect from './filters/MultiSelect';
import { ACTION_ORDER } from '@/constants/actions';
import type { User } from '@/types/user.type';
import { formatUserFullName } from '@/utils/formats';
import { useFetchUsers } from '@/api';

interface FiltersPanelProps {
    startDate: Date | null;
    endDate: Date | null;
    onDateChange: (start: Date | null, end: Date | null) => void;
    onActionChange: (actions: string[]) => void;
    onUserChange: (users: string[]) => void;
}

function FiltersPanel({ startDate, endDate, onDateChange, onActionChange, onUserChange }: FiltersPanelProps) {
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const { users, isLoading: isLoadingUsers, isError: isErrorUsers } = useFetchUsers();

    return (
        <div className='bg-[#0f172a] border border-[#1e293b] rounded-md p-4 flex flex-col gap-4'>
            <div className='flex gap-2'>
                <DateRangePicker startDate={startDate} endDate={endDate} onChange={onDateChange} />
            </div>
            <MultiSelect
                options={ACTION_ORDER.map(action => ({ label: String(action), value: String(action) }))}
                selected={selectedActions}
                onChange={(actions) => {
                    setSelectedActions(actions);
                    onActionChange(actions);
                }}
                placeholder="Select Actions"
            />
            <MultiSelect
                options={users ? users.data.map((user: User) => ({ label: formatUserFullName(user.prefix, user.firstname, user.lastname), value: user._id })) : []}
                selected={selectedUsers}
                onChange={(users) => {
                    setSelectedUsers(users);
                    onUserChange(users);
                }}
                placeholder="Select Users"
                disabled={isLoadingUsers || isErrorUsers}
            />
        </div>
    )
}

export default FiltersPanel