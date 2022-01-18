import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import StyledWrapper from './StyledWrapper';
import QueryEditor from '../QueryEditor';
import RequestHeaders from '../RequestHeaders';

const RequestPane = ({onRunQuery, schema, leftPaneWidth, value, onQueryChange}) => {
  return (
    <StyledWrapper className="h-full">
      <Tabs className='react-tabs mt-1 flex flex-grow flex-col h-full' forceRenderTabPanel>
        <TabList>
          <Tab tabIndex="-1">Query</Tab>
          <Tab tabIndex="-1">Headers</Tab>
        </TabList>
        <TabPanel>
          <QueryEditor
            schema={schema}
            width={leftPaneWidth}
            value={value}
            onRunQuery={onRunQuery}
            onEdit={onQueryChange}
          />
        </TabPanel>
        <TabPanel>
          <RequestHeaders />
        </TabPanel>
      </Tabs>
    </StyledWrapper>
  )
};

export default RequestPane;