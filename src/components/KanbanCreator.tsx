import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { kanbanListState } from '../recoil';
import React from 'react';
import './KanbanCreator.scss';

function KanbanCreator({ title }: { title: string }) {
  const [kanbanList, setKanbanList] = useRecoilState(kanbanListState);

  const getId: number =
    kanbanList.length > 0 ? kanbanList[kanbanList.length - 1].id + 1 : 0;

  const addCard = useCallback(
    () => {
      setKanbanList((prev) => [
        ...prev,
        {
          id: getId,
          title: '',
          content: '',
          category: title,
          isChecked: false,
        },
      ]);
    },
    [getId, setKanbanList, title]
  );

  return (
    <div className="addBtnWrap">
      <button className="cardAddBtn" onClick={addCard}>
        + Add task
      </button>
    </div>
  );
}

export default React.memo(KanbanCreator);
