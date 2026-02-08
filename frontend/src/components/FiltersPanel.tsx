import DateRangePicker from './filters/DateRangePicker'

interface FiltersPanelProps {
    startDate: Date | null;
    endDate: Date | null;
    onDateChange: (start: Date | null, end: Date | null) => void;
}

function FiltersPanel({ startDate, endDate, onDateChange }: FiltersPanelProps) {

    return (
        <div>
            <DateRangePicker startDate={startDate} endDate={endDate} onChange={onDateChange} />
        </div>
    )
}

export default FiltersPanel