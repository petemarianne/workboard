import React, { useContext, useEffect, useState } from 'react';
import './WorkArea.scss';
import { ItemsContext } from '../../context/items-content';
import { Close } from '@material-ui/icons';
import { PositionAndSize, Size } from '../../interfaces';

export const WorkArea: React.FC = (): JSX.Element => {
    const {images, texts, setTexts, setImages} = useContext(ItemsContext);

    const [curId, setCurId] = useState<string>('');
    const [doubleClick, setDoubleClick] = useState<string>('');
    const [offset, setOffset] = useState<number[]>([0,0]);
    const [areaPosAndSize, setAreaPosAndSize] = useState<PositionAndSize>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const [itemSize, setItemSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const obj = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        };
        const workArea = document.getElementsByClassName('workarea')[0];
        obj.top = workArea.getBoundingClientRect().top;
        obj.left = workArea.getBoundingClientRect().left;
        const width = getComputedStyle(workArea).width;
        obj.width = Number(width.substring(0, width.length - 2));
        const height = getComputedStyle(workArea).height;
        obj.height = Number(height.substring(0, height.length - 2));
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
    }, [curId]);

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

    const removeItem = (id: string): void => {
        if (id.startsWith('text')) setTexts(texts.filter(item => item.id !== id));
        else setImages(images.filter(item => item.id !== id));
    }

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
                                {
                                    top: !image.position ? undefined : image.position.y <= areaPosAndSize.top ?
                                        '0' : image.position.y + itemSize.height >= areaPosAndSize.height + areaPosAndSize?.top ?
                                            `${areaPosAndSize.height - itemSize.height}px` :`calc(${image.position.y}px - ${areaPosAndSize.top}px)`,
                                    left: !image.position ? undefined : image.position.x <= areaPosAndSize.left ?
                                        '0' : image.position.x + itemSize.width >= areaPosAndSize.width + areaPosAndSize.left ?
                                            `${areaPosAndSize.width - itemSize.width - 4}px` :`calc(${image.position.x}px - ${areaPosAndSize.left}px)`,
                                    resize: doubleClick === image.id ? 'both' : undefined,
                                    overflow: doubleClick === image.id ? 'auto' : undefined,
                                    backgroundImage: image.image ? `url("${image.image}")` : undefined,
                                    border: curId === image.id || doubleClick === image.id ? '2px solid rgba(0, 0, 139, 0.4)' : image.image ? 'none' : '1px solid rgba(0, 0, 139, 0.4)'
                                }
                            }
                            onMouseDown={doubleClick ? undefined : (e) => onMouseDown(e, image.id)}
                            onDoubleClick={() => setDoubleClick(image.id)}
                        >
                            {image.image ? null :
                                <label className='label'>
                                    Upload File
                                    <input type='file' onChange={e => onFileChange(e, image.id)} hidden />
                                </label>
                            }
                            {image.id === doubleClick && doubleClick ? <Close fontSize='small' color='secondary' className='close' onClick={() => removeItem(image.id)} /> : null}
                        </div>
                )}
                {texts.map(text =>
                    <div
                        key={text.id}
                        id={text.id}
                        tabIndex={0}
                        className='text-wrapper'
                        onMouseDown={doubleClick ? undefined : (e) => onMouseDown(e, text.id)}
                        onDoubleClick={() => setDoubleClick(text.id)}
                        style={{
                            top: !text.position ? undefined : text.position.y <= areaPosAndSize.top ?
                                '0' : text.position.y + itemSize.height >= areaPosAndSize.height + areaPosAndSize.top ?
                                    `${areaPosAndSize.height - itemSize.height - 2}px` :`calc(${text.position.y}px - ${areaPosAndSize.top}px)`,
                            left: !text.position ? undefined : text.position.x <= areaPosAndSize.left ?
                                '0' : text.position.x + itemSize.width >= areaPosAndSize.width + areaPosAndSize.left ?
                                    `${areaPosAndSize.width - itemSize.width - 7}px` :`calc(${text.position.x}px - ${areaPosAndSize.left}px)`,
                            resize: doubleClick === text.id ? 'both' : undefined,
                            overflow: doubleClick === text.id ? 'auto' : undefined,
                            border: curId === text.id || doubleClick === text.id ? '2px solid rgba(0, 0, 139, 0.4)' : undefined
                        }}
                    >
                        <textarea placeholder='Text...' className='text' />
                        {text.id === doubleClick && doubleClick ? <Close fontSize='small' color='secondary' className='close' onClick={() => removeItem(text.id)} /> : null}
                    </div>
                )}
            </div>
        </div>
    );
}
