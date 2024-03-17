import React from 'react';
import KanbanCreator from './KanbanCreator';
import { useDrop } from 'react-dnd';
import './KanbanList.scss';

function KanbanList({ title, children }: { title: string; children: any }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'card',
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <>
      <div className="kanbanListWrap" ref={drop}>
        <div className="kanbanTitle">{title}</div>
        {children}
        <KanbanCreator title={title} />
      </div>
    </>
  );
}

export default React.memo(KanbanList);
