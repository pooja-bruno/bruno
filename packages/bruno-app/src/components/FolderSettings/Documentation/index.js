import 'github-markdown-css/github-markdown.css';
import get from 'lodash/get';
import { updateFolderDocs } from 'providers/ReduxStore/slices/collections';
import { useTheme } from 'providers/Theme';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveFolderRoot } from 'providers/ReduxStore/slices/collections/actions';
import Markdown from 'components/MarkDown';
import CodeEditor from 'components/CodeEditor';
import StyledWrapper from './StyledWrapper';
import { IconDeviceFloppy } from '@tabler/icons';

const Documentation = ({ collection, folder }) => {
  const dispatch = useDispatch();
  const { displayedTheme } = useTheme();
  const preferences = useSelector((state) => state.app.preferences);
  const [isEditing, setIsEditing] = useState(false);
  const docs = get(folder, 'root.docs', '');
  const { theme } = useTheme();


  const toggleViewMode = () => {
    setIsEditing((prev) => !prev);
  };

  const onEdit = (value) => {
    dispatch(
      updateFolderDocs({
        folderUid: folder.uid,
        collectionUid: collection.uid,
        docs: value
      })
    );
  };

  const onSave = () => dispatch(saveFolderRoot(collection.uid, folder.uid));

  if (!folder) {
    return null;
  }

  return (
    <StyledWrapper className="mt-1 h-full w-full relative flex flex-col">
      <div className="editing-mode mb-2 flex justify-between items-center" role="tab" onClick={toggleViewMode}>
        {isEditing ? 'Preview' : 'Edit'}
      </div>

      {isEditing ? (
        <div className="flex-1 mt-2">
          <CodeEditor
            collection={collection}
            theme={displayedTheme}
            value={docs || ''}
            onEdit={onEdit}
            onSave={onSave}
            mode="application/text"
            font={get(preferences, 'font.codeFont', 'default')}
            fontSize={get(preferences, 'font.codeFontSize')}
          />
          <button type="submit" className="submit btn btn-sm btn-secondary my-6" onClick={onSave}>
            Save
          </button>
        </div>
      ) : (
        <Markdown collectionPath={collection.pathname} onDoubleClick={toggleViewMode} content={docs} />
      )}
    </StyledWrapper>
  );
};

export default Documentation;
