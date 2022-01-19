/*
 * @Author: lijunwei
 * @Date: 2022-01-19 19:21:22
 * @LastEditTime: 2022-01-19 19:40:02
 * @LastEditors: lijunwei
 * @Description: 
 */




import { Button, DatePicker, Icon, Popover } from "@shopify/polaris";
import { CalendarMinor } from "@shopify/polaris-icons";
import { useCallback, useMemo, useState } from "react";

function DatePopover(props) {

  const [popoverActive, setPopoverActive] = useState(false);



  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const [{ month, year }, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );



  const dataButtonText = useMemo(() => {
    const text = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    return text
  }, [selectedDate]);

  const activator = useMemo(() => <Button
    fullWidth
    id="id3s"
    icon={<Icon source={CalendarMinor}></Icon>}
    onClick={() => { setPopoverActive(!popoverActive) }}
  >
    { dataButtonText }
  </Button>,
    [dataButtonText, popoverActive]
  );



  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      ariaHaspopup={false}
      sectioned
    >

      <DatePicker
        month={month}
        year={year}
        onChange={(v) => { setSelectedDate(v.start) }}
        onMonthChange={handleMonthChange}
        selected={selectedDate}
      />

    </Popover>
  );
}

export { DatePopover }