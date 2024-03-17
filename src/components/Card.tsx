import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useRecoilState } from 'recoil';
import { TITLE_NAME } from '../App';
import { kanbanListState } from '../recoil';
import './Card.scss';

function Card({ item }: { item: cardtype }) {
  const [list, setList] = useRecoilState(kanbanListState);
  const [badgeColor, setBadgeColor] = useState('');
  const index = list.findIndex((data) => data === item);
  const ref = useRef<HTMLTextAreaElement>(null);
  const { TO_DO, IN_PROGRESS, DONE, NOTE } = TITLE_NAME;

  const replaceIndex = (list: cardtype[], index: number, data: cardtype) => {
    return [...list.slice(0, index), data, ...list.slice(index + 1)];
  };

  const editTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newList = replaceIndex(list, index, {
      ...item,
      title: e.target.value,
    });
    setList(newList);
  };
  const editText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newList = replaceIndex(list, index, {
      ...item,
      content: e.target.value,
    });
    setList(newList);
  };

  const handleResizeHeight = useCallback(() => {
    if (ref === null || ref.current === null) {
      return;
    }
    ref.current.style.height = '70px';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }, []);

  const deleteItem = () => {
    setList([...list.slice(0, index), ...list.slice(index + 1)]);
  };

  const changeItemCategory = (selectedItem: cardtype, title: string) => {
    setList((prev) => {
      return prev.map((e) => {
        return {
          ...e,
          category: e.id === selectedItem.id ? title : e.category,
        };
      });
    });
  };

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'card',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item: cardtype, monitor) => {
      const dropResult: drop | null = monitor.getDropResult();
      if (dropResult) {
        switch (dropResult.name) {
          case TO_DO:
            changeItemCategory(item, TO_DO);
            break;
          case IN_PROGRESS:
            changeItemCategory(item, IN_PROGRESS);
            break;
          case DONE:
            changeItemCategory(item, DONE);
            break;
          case NOTE:
            changeItemCategory(item, NOTE);
            break;
        }
      }
    },
  }));

  useEffect(() => {
    switch (item.category) {
      case TO_DO:
        setBadgeColor('#ef5777');
        break;
      case IN_PROGRESS:
        setBadgeColor('#B33771');
        break;
      case DONE:
        setBadgeColor('#341f97');
        break;
      case NOTE:
        setBadgeColor('#130f40');
        break;
    }
  }, [item]);

  return (
    <div
      className="cardWrap"
      ref={dragRef}
      style={{ opacity: isDragging ? '0.3' : '1' }}
    >
      <div className="cardHeaderWrap">
        <span
          className="cardTitleBadge"
          style={{ backgroundColor: badgeColor }}
        >
          {item.category}
        </span>
        <img
          className="deleteimg"
          src="images/cancel.png"
          alt="delete"
          onClick={deleteItem}
        />
      </div>
      <input
        className="cardTitle"
        type="text"
        value={item.title}
        onChange={editTitle}
        placeholder="제목을 입력하세요"
      />
      <textarea
        className="cardContent"
        value={item.content}
        onChange={editText}
        onInput={handleResizeHeight}
        ref={ref}
        placeholder="내용을 입력하세요"
        spellCheck="false"
      />
    </div>
  );
}

export default React.memo(Card);
