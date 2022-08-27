import React, { useContext, useEffect, useState } from 'react';
import './Workarea.scss';
import { ItemsContext } from '../../context/items-content';

export const Workarea: React.FC = (): JSX.Element => {
    const {images, texts, setTexts, setImages} = useContext(ItemsContext);

    const [curId, setCurId] = useState<string>('');
    const [doubleClick, setDoubleClick] = useState<string>('');
    const [deleteClick, setDeleteClick] = useState<string>('');
    const [offset, setOffset] = useState([0,0]);
    const [areaPosAndSize, setAreaPosAndSize] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [itemSize, setItemSize] = useState({
        width: 0,
        height: 0,
    });

    const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        let id = event.dataTransfer.getData('id');
        if (id.startsWith('text')) setTexts(prevState => [...prevState, {id, text: '', position: {x: event.clientX, y: event.clientY}}]);
        else setImages(prevState => [...prevState, {id, image: '', position: {x: event.clientX, y: event.clientY}}]);
    }

    const onMouseDown = (event: React.MouseEvent<HTMLTextAreaElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>, id: string): void => {
        setCurId(id);
        const item = id.startsWith('text') ? texts.filter(item => item.id === id)[0] : images.filter(item => item.id === id)[0];
        if (item.position) setOffset([item.position.x - event.clientX, item.position.y - event.clientY]);
        else {
            const div = document.getElementById(id);
            if (div) setOffset([div.getBoundingClientRect().left - event.clientX, div.getBoundingClientRect().top - event.clientY]);
        }
    }

    const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();
        const newPosition = {
            x: event.clientX + offset[0],
            y: event.clientY + offset[1]
        }
            if (curId) {
                if (curId.startsWith('text')) {
                    const newArray = texts.filter(item => item.id !== curId);
                    const item = texts.filter(item => item.id === curId)[0];
                    item.position = newPosition;
                    setTexts([...newArray, item]);
                } else {
                    const newArray = images.filter(item => item.id !== curId);
                    const item = images.filter(item => item.id === curId)[0];
                    item.position = newPosition;
                    setImages([...newArray, item]);
                }
            }
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: string): void => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newArray = images.filter(item => item.id !== id);
                const item = images.filter(item => item.id === id)[0];
                item.image = reader.result as string;
                setImages([...newArray, item]);
            }
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        const obj = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        };
        const workarea = document.getElementsByClassName('workarea')[0];
        obj.top = workarea.getBoundingClientRect().top;
        obj.left = workarea.getBoundingClientRect().left;
        const width = getComputedStyle(workarea).width;
        obj.width = Number(width.substring(0, width.length - 2));
        const height = getComputedStyle(workarea).height;
        obj.height = Number(height.substring(0, height.length - 2));
        console.log(obj)
        setAreaPosAndSize(obj);
    }, []);

    useEffect(() => {
        const div = document.getElementById(curId);
        if (div) {
            const obj = {
                height: 0,
                width: 0,
            }
            const width = getComputedStyle(div).width;
            obj.width = Number(width.substring(0, width.length - 2));
            const height = getComputedStyle(div).height;
            obj.height = Number(height.substring(0, height.length - 2));
            setItemSize(obj);
        }
    }, [curId])

    return (
        <div className='workarea-container'>
            Workarea
            <div
                className='workarea'
                onDragOver={event => event.preventDefault()}
                onDrop={onDrop}
                onMouseUp={doubleClick ? undefined : () => setCurId('')}
                onMouseMove={doubleClick ? undefined : onMouseMove}
                onClick={() => setDoubleClick('')}
            >
                {images.map(image =>
                    <div
                        key={image.id}
                        className='image'
                        tabIndex={0}
                        id={image.id}
                        style={
                            image.position
                                ?
                                {
                                    top: image.position.y <= areaPosAndSize.top ?
                                        '0' : image.position.y + itemSize.height >= areaPosAndSize.height + areaPosAndSize.top ?
                                            `${areaPosAndSize.height - itemSize.height}px` :`calc(${image.position.y}px - ${areaPosAndSize.top}px)`,
                                    left: image.position.x <= areaPosAndSize.left ?
                                        '0' : image.position.x + itemSize.width >= areaPosAndSize.width + areaPosAndSize.left ?
                                            `${areaPosAndSize.width - itemSize.width - 4}px` :`calc(${image.position.x}px - ${areaPosAndSize.left}px)`,
                                    resize: doubleClick === image.id ? 'both' : undefined,
                                    overflow: doubleClick === image.id ? 'auto' : undefined,
                                    backgroundImage: image.image ? `url("${image.image}")` : undefined,
                                    borderColor: image.image ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 139, 0.4)'
                                }
                                :
                                {
                                    backgroundImage: image.image ? `url("${image.image}")` : undefined,
                                    borderColor: image.image ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 139, 0.4)'
                                }
                        }
                        onMouseDown={doubleClick ? undefined : (e) => onMouseDown(e, image.id)}
                        onDoubleClick={() => setDoubleClick(image.id)}
                        onFocus={() => setDeleteClick(image.id)}
                        onBlur={() => setDeleteClick('')}
                    >
                        {image.image ? null :
                            <label className='label'>
                                Upload File
                                <input type='file' onChange={e => onFileChange(e, image.id)} hidden/>
                            </label>
                        }
                    </div>
                )}
                {texts.map(text =>
                        <textarea
                            key={text.id}
                            id={text.id}
                            className='text'
                            placeholder='Text...'
                            onDoubleClick={() => setDoubleClick(text.id)}
                            onFocus={() => setDeleteClick(text.id)}
                            onBlur={() => setDeleteClick('')}
                            style={
                                text.position
                                    ?
                                    {
                                        top: text.position.y <= areaPosAndSize.top ?
                                            '0' : text.position.y + itemSize.height >= areaPosAndSize.height + areaPosAndSize.top ?
                                                `${areaPosAndSize.height - itemSize.height - 2}px` :`calc(${text.position.y}px - ${areaPosAndSize.top}px)`,
                                        left: text.position.x <= areaPosAndSize.left ?
                                            '0' : text.position.x + itemSize.width >= areaPosAndSize.width + areaPosAndSize.left ?
                                                `${areaPosAndSize.width - itemSize.width - 7}px` :`calc(${text.position.x}px - ${areaPosAndSize.left}px)`,
                                        resize: doubleClick === text.id ? 'both' : undefined
                                    }
                                    :
                                    undefined
                            }
                            onMouseDown={doubleClick ? undefined : (e) => onMouseDown(e, text.id)}
                        />
                )}
            </div>
        </div>
    );
}
