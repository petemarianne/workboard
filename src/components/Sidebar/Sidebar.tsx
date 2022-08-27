import React, { useContext } from 'react';
import './Sidebar.scss';
import { ItemsContext } from '../../context/items-content';

export const Sidebar: React.FC = (): JSX.Element => {
    const {setImages, setTexts, texts, images} = useContext(ItemsContext);

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, type: string): void => {
        const id = type === 'text' ? `text${texts.length}` : `image${images.length}`;
        event.dataTransfer.setData('id', id);
    }

    return (
        <div className='sidebar'>
            Sidebar
            <div
                className='text'
                onClick={() => {setTexts(prevState => [...prevState, {id: `text${prevState.length}`, text: ''}])}}
                onDragStart={(e) => onDragStart(e, 'text')}
                draggable
            >Text</div>
            <div
                className='image'
                onClick={() => {setImages(prevState => [...prevState, {id: `image${prevState.length}`, image: ''}])}}
                onDragStart={(e) => onDragStart(e, 'image')}
                draggable
            >Image</div>
        </div>
    );
}
