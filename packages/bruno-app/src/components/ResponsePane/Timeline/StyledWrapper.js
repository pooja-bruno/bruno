import styled from 'styled-components';

const StyledWrapper = styled.div`
  height: auto;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  
  .line {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-all;
    font-family: Inter, sans-serif !important;

    .arrow {
      opacity: 0.5;
    }

    &.request {
      color: ${(props) => props.theme.colors.text.green};
    }

    &.response {
      color: ${(props) => props.theme.colors.text.purple};
    }
  }
`;

export default StyledWrapper;
