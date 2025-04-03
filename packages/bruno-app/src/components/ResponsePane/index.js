import React, { useState, useEffect } from 'react';
import find from 'lodash/find';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { updateResponsePaneTab } from 'providers/ReduxStore/slices/tabs';
import QueryResult from './QueryResult';
import Overlay from './Overlay';
import Placeholder from './Placeholder';
import ResponseHeaders from './ResponseHeaders';
import StatusCode from './StatusCode';
import ResponseTime from './ResponseTime';
import ResponseSize from './ResponseSize';
import Timeline from './Timeline';
import TestResults from './TestResults';
import TestResultsLabel from './TestResultsLabel';
import ScriptError from './ScriptError';
import ScriptErrorIcon from './ScriptErrorIcon';
import StyledWrapper from './StyledWrapper';
import ResponseSave from 'src/components/ResponsePane/ResponseSave';
import ResponseClear from 'src/components/ResponsePane/ResponseClear';
import ClearTimeline from './ClearTimeline/index';

const ResponsePane = ({ rightPaneWidth, item, collection }) => {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabs);
  const activeTabUid = useSelector((state) => state.tabs.activeTabUid);
  const isLoading = ['queued', 'sending'].includes(item.requestState);
  const [showScriptErrorCard, setShowScriptErrorCard] = useState(false);

  const requestTimeline = ([...(collection.timeline || [])]).filter(obj => {
    if (obj.itemUid === item.uid) return true;
  });

  useEffect(() => {
    if (item?.preRequestScriptErrorMessage || item?.postResponseScriptErrorMessage) {
      setShowScriptErrorCard(true);
    }
  }, [item?.preRequestScriptErrorMessage, item?.postResponseScriptErrorMessage]);

  const selectTab = (tab) => {
    dispatch(
      updateResponsePaneTab({
        uid: item.uid,
        responsePaneTab: tab
      })
    );
  };

  const response = item.response || {};

  const getTabPanel = (tab) => {
    switch (tab) {
      case 'response': {
        return (
          <QueryResult
            item={item}
            collection={collection}
            width={rightPaneWidth}
            data={response.data}
            dataBuffer={response.dataBuffer}
            headers={response.headers}
            error={response.error}
            key={item.filename}
          />
        );
      }
      case 'headers': {
        return <ResponseHeaders headers={response.headers} />;
      }
      case 'timeline': {
        return <Timeline collection={collection} item={item} width={rightPaneWidth}  />;
      }
      case 'tests': {
        return <TestResults results={item.testResults} assertionResults={item.assertionResults} />;
      }

      default: {
        return <div>404 | Not found</div>;
      }
    }
  };

  if (isLoading && !item.response) {
    return (
      <StyledWrapper className="flex flex-col h-full relative">
        <Overlay item={item} collection={collection} />
      </StyledWrapper>
    );
  }

  if (!item.response && !requestTimeline?.length) {
    return (
      <StyledWrapper className="flex h-full relative">
        <Placeholder />
      </StyledWrapper>
    );
  }

  if (!activeTabUid) {
    return <div>Something went wrong</div>;
  }

  const focusedTab = find(tabs, (t) => t.uid === activeTabUid);
  if (!focusedTab || !focusedTab.uid || !focusedTab.responsePaneTab) {
    return <div className="pb-4 px-4">An error occurred!</div>;
  }

  const getTabClassname = (tabName) => {
    return classnames(`tab select-none ${tabName}`, {
      active: tabName === focusedTab.responsePaneTab
    });
  };

  const responseHeadersCount = typeof response.headers === 'object' ? Object.entries(response.headers).length : 0;
  
  const hasScriptError = item?.preRequestScriptErrorMessage || item?.postResponseScriptErrorMessage;

  return (
    <StyledWrapper className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-wrap items-center pl-3 pr-4 tabs shrink-0" role="tablist">
        <div className={getTabClassname('response')} role="tab" onClick={() => selectTab('response')}>
          Response
        </div>
        <div className={getTabClassname('headers')} role="tab" onClick={() => selectTab('headers')}>
          Headers
          {responseHeadersCount > 0 && <sup className="ml-1 font-medium">{responseHeadersCount}</sup>}
        </div>
        <div className={getTabClassname('timeline')} role="tab" onClick={() => selectTab('timeline')}>
          Timeline
        </div>
        <div className={getTabClassname('tests')} role="tab" onClick={() => selectTab('tests')}>
          <TestResultsLabel results={item.testResults} assertionResults={item.assertionResults} />
        </div>
        {!isLoading ? (
          <div className="flex flex-grow justify-end items-center">
            {hasScriptError && !showScriptErrorCard && (
              <ScriptErrorIcon 
                itemUid={item.uid} 
                onClick={() => setShowScriptErrorCard(true)} 
              />
            )}
            {focusedTab?.responsePaneTab === "timeline" ? (
              <ClearTimeline item={item} collection={collection} />
            ) : item?.response ? (
              <>
                <ResponseClear item={item} collection={collection} />
                <ResponseSave item={item} />
                <StatusCode status={response.status} />
                <ResponseTime duration={response.duration} />
                <ResponseSize size={response.size} />
              </>
            ) : null}
          </div>
        ) : null}
      </div>
      <section
        className={`flex flex-col flex-1 overflow-hidden relative pl-3 pr-4 ${focusedTab.responsePaneTab === 'response' ? '' : 'mt-4'}`}
      >
        {isLoading ? <Overlay item={item} collection={collection} /> : null}
        {hasScriptError && showScriptErrorCard && (
          <ScriptError 
            item={item} 
            onClose={() => setShowScriptErrorCard(false)} 
          />
        )}
        <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-210px)]">
          {!item?.response ? (
            focusedTab?.responsePaneTab === "timeline" && requestTimeline?.length ? (
              <Timeline
                collection={collection}
                item={item}
                width={rightPaneWidth}
              />
            ) : null
          ) : (
            getTabPanel(focusedTab.responsePaneTab)
          )}
        </div>
      </section>
    </StyledWrapper>
  );
};

export default ResponsePane;
