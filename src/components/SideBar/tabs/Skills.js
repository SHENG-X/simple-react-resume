import React, { useState, useContext, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import AppContext from '../../../context/AppContext';
import Checkbox from '../../../shared/Checkbox';
import TextField from '../../../shared/TextField';
import { addItem, deleteItem, moveItemUp, moveItemDown, animateDown, animateUp, animateRemove } from '../../../utils';
import ItemHeading from '../../../shared/ItemHeading';

const SkillsTab = ({ data, config, onChange }) => {
    const context = useContext(AppContext);
    const { dispatch } = context;

    return (
        <>
            <div className="mb-6 grid grid-cols-6 items-center">
                <div className="col-span-1">
                    <Checkbox
                        checked={config.skills.enable}
                        onChange={v => onChange('config.skills.enable', v)}
                    />
                </div>
                <div className="col-span-5">
                    <TextField
                        placeholder="Heading"
                        value={config.skills.heading}
                        onChange={v => onChange('config.skills.heading', v)}
                    />
                </div>
            </div>

            <hr className="my-6" />
            
            <AddItem heading={config.skills.heading} dispatch={dispatch} />

            {
                data.skills.map((x, index) => (
                    <Item item={x} key={x.id} index={index} size={data.skills.length} onChange={onChange} dispatch={dispatch} />
                ))
            }
        </>
    );
};

const Form = ({ item, onChange }) => {
    return (
        <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="Team Building &amp; Training"
            value={item.skill}
            onChange={e => onChange(e.target.value)}
            type="text"
        />
    );
};

const AddItem = ({ heading, dispatch }) => {
    const [isOpen, setOpen] = useState(false);
    const [item, setItem] = useState({
        id: uuidv4(),
        skill: ''
    });

    const add = () => {
        if (item.skill === '') return;

        addItem(dispatch, 'skills', item);

        setItem({
            id: uuidv4(),
            skill: ''
        });
    };

    return (
        <div className="my-4 border border-gray-200 rounded p-5 hover:shadow-listItem">
            <ItemHeading heading={heading} setOpen={setOpen} isOpen={isOpen} />

            <div className={`mt-6 ${isOpen ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <Form item={item} onChange={v => setItem({...item, skill: v})} />
                    </div>

                    <button
                        type="button"
                        onClick={add}
                        className="col-span-1 bg-gray-600 hover:bg-gray-700 text-sm font-medium rounded"
                    >
                        <div className="flex justify-center items-center">
                            <i className="material-icons font-bold text-white text-lg">add</i>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Item = ({ item, index, size, onChange, dispatch }) => {
    const identifier = `data.skills[${index}]`;
    const itemRef = useRef(null);

    return (
        <div className="my-4 grid grid-cols-12 animate__animated" ref={itemRef}>
            <div className="col-span-9">
                <Form item={item} onChange={v => onChange(identifier, {...item, skill: v})} />
            </div>

            <button
                type="button"
                onClick={() => animateUp(itemRef, (index === 0), ()=>{
                    moveItemUp(dispatch, 'skills', item)
                  })
                }
                className="col-span-1 text-gray-600 hover:text-red-600 text-sm font-medium"
            >
                <div className="flex justify-end items-center">
                    <i className="material-icons font-bold text-lg">arrow_upward</i>
                </div>
            </button>

            <button
                type="button"
                onClick={() => animateDown(itemRef, (index === size - 1), ()=>{
                    moveItemDown(dispatch, 'skills', item)
                  })
                }
                className="col-span-1 text-gray-600 hover:text-red-600 text-sm font-medium"
            >
                <div className="flex justify-end items-center">
                    <i className="material-icons font-bold text-lg">arrow_downward</i>
                </div>
            </button>

            <button
                type="button"
                onClick={() => animateRemove(itemRef, ()=> {
                    deleteItem(dispatch, 'skills', item)
                  })
                }
                className="col-span-1 text-gray-600 hover:text-red-600 text-sm font-medium"
            >
                <div className="flex justify-end items-center">
                    <i className="material-icons font-bold text-lg">close</i>
                </div>
            </button>
        </div>
    );
};

export default SkillsTab;
