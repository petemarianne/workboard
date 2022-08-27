import React, { useState, useEffect } from 'react';
import { TextItem, ImageItem } from './interfaces';
import { ItemsContext } from './context/items-content';
import './App.scss';
import { Sidebar, WorkArea } from './components';
import { Button } from '@material-ui/core';

const App: React.FC = (): JSX.Element => {
    const [texts, setTexts] = useState<TextItem[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);

    useEffect(() => {
        if (localStorage.getItem('workBoardData')) {
            const data = JSON.parse(localStorage.getItem('workBoardData') as string);
            setTexts(data.texts);
            setImages(data.images);
        } else {
            localStorage.setItem('workBoardData', JSON.stringify({
                texts,
                images,
            }));
        }
        }, [])

    useEffect(() => {
        if (JSON.stringify(texts) !== '[]' || JSON.stringify(images) !== '[]') {
            localStorage.setItem('workBoardData', JSON.stringify({
                texts,
                images,
            }));
        }
    }, [texts, images])

    const reset = (): void => {
        setTexts([]);
        setImages([]);
        localStorage.setItem('workBoardData', JSON.stringify({
            texts: [],
            images: [],
        }));
    }

  return (
    <div className='App'>
        WorkBoard
        <ItemsContext.Provider value={{texts, images, setImages, setTexts}}>
            <div className='areas-wrapper'>
                <Sidebar />
                <WorkArea />
            </div>
            <Button color='primary' variant='contained' className='button' onClick={reset}>Reset</Button>
        </ItemsContext.Provider>
    </div>
  );
}

export default App;
