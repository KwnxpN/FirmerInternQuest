import { useState } from 'react';
import DateRangePicker from './filters/DateRangePicker'
import MultiSelect from './filters/MultiSelect';
import { ACTION_ORDER } from '@/constants/actions';

interface FiltersPanelProps {
    startDate: Date | null;
    endDate: Date | null;
    onDateChange: (start: Date | null, end: Date | null) => void;
    onActionChange: (actions: string[]) => void;
}

function FiltersPanel({ startDate, endDate, onDateChange, onActionChange }: FiltersPanelProps) {
    const [selectedActions, setSelectedActions] = useState<string[]>([]);

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
        </div>
    )
}

export default FiltersPanel