import React, { useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import set from 'lodash/set';

import TextField from '../../../shared/TextField';
import RichTextArea from '../../../shared/RichTextArea';
import AppContext from '../../../context/AppContext';
import Checkbox from '../../../shared/Checkbox';
import { addItem } from '../../../utils';
import ItemActions from '../../../shared/ItemActions';
import AddItemButton from '../../../shared/AddItemButton';
import ItemHeading from '../../../shared/ItemHeading';

const EducationTab = ({ data, config, onChange }) => {
    const context = useContext(AppContext);
    const { dispatch } = context;

    return (
        <>
            <div className="mb-6 grid grid-cols-6 items-center">
                <div className="col-span-1">
                    <Checkbox
                        checked={config.education.enable}
                        onChange={v => onChange('config.education.enable', v)}
                    />
                </div>

                <div className="col-span-5">
                    <TextField
                        placeholder="Heading"
                        value={config.education.heading}
                        onChange={v => onChange('config.education.heading', v)}
                    />
                </div>
            </div>

            <hr className="my-6" />

            <AddItem heading={config.education.heading} dispatch={dispatch} />
            
            {data.education.map((x, index) => (
                <Item
                    item={x}
                    key={x.id}
                    index={index}
                    onChange={onChange}
                    dispatch={dispatch}
                    first={index === 0}
                    last={index === data.education.length - 1}
                />
            ))}
        </>
    );
};

const Form = ({ item, onChange, identifier = '' }) => {
    const { t } = useTranslation(['sideBar', 'app']);

    return (
        <div>
            <TextField
                className="mb-6"
                label={t('education.institution.label')}
                placeholder="Harvard University"
                value={item.institution}
                onChange={v => onChange(`${identifier}institution`, v)}
            />

            <TextField
                className="mb-6"
                label={t('education.location.label')}
                placeholder="NYC, NY"
                value={item.location}
                onChange={v => onChange(`${identifier}location`, v)}
            />

            <TextField
                className="mb-6"
                label={t('education.major.label')}
                placeholder="Masters in Computer Science"
                value={item.major}
                onChange={v => onChange(`${identifier}major`, v)}
            />

            <TextField
                className="mb-6"
                label={t('education.gpa.label')}
                placeholder="4.0 GPA"
                value={item.gpa}
                onChange={v => onChange(`${identifier}gpa`, v)}
            />

            <div className="grid grid-cols-2 col-gap-4">
                <TextField
                    className="mb-6"
                    label={t('app:item.startDate.label')}
                    placeholder="March 2018"
                    value={item.startDate}
                    onChange={v => onChange(`${identifier}startDate`, v)}
                />

                <TextField
                    className="mb-6"
                    label={t('app:item.endDate.label')}
                    placeholder="June 2022"
                    value={item.endDate}
                    onChange={v => onChange(`${identifier}endDate`, v)}
                />
            </div>

            <RichTextArea
                className="mb-6"
                label={t('app:item.description.label')}
                value={item.description}
                onChange={v => onChange(`${identifier}description`, v)}
                narrow
            />

        </div>
    );
};

const AddItem = ({ heading, dispatch }) => {

    const educationItem = {
        id: uuidv4(),
        enable: true,
        institution: '',
        location: '',
        major: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
    };

    const [isOpen, setOpen] = useState(false);
    const [item, setItem] = useState({...educationItem});

    const onChange = (key, value) => setItem(set({ ...item }, key, value));

    const onSubmit = () => {
        if (item.name === '' || item.major === '') return;

        addItem(dispatch, 'education', item);

        setItem({...educationItem});

        setOpen(false);
    };

    return (
        <div className="my-4 border border-gray-200 rounded p-5 hover:shadow-listItem">
            <ItemHeading heading={heading} setOpen={setOpen} isOpen={isOpen} />

            <div className={`mt-6 ${isOpen ? 'block' : 'hidden'}`}>
                <Form item={item} onChange={onChange} />
                <AddItemButton onSubmit={onSubmit} />
            </div>
        </div>
    );
};

const Item = ({ item, index, onChange, dispatch, first, last }) => {
    const [isOpen, setOpen] = useState(false);
    const identifier = `data.education[${index}].`;
    const itemRef = useRef(null);

    return (
        <div className="my-4 border border-gray-200 rounded p-5 animate__animated hover:shadow-listItem" ref={itemRef}>
            <ItemHeading title={item.institution} setOpen={setOpen} isOpen={isOpen} />

            <div className={`mt-6 ${isOpen ? 'block' : 'hidden'}`}>
                <Form item={item} onChange={onChange} identifier={identifier} />

                <ItemActions
                    dispatch={dispatch}
                    first={first}
                    identifier={identifier}
                    item={item}
                    last={last}
                    onChange={onChange}
                    itemRef={itemRef}
                    setOpen={setOpen}
                    type="education"
                />
            </div>
        </div>
    );
};

export default EducationTab;
