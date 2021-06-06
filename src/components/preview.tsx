import './preview.css'
import { useRef, useEffect } from 'react'

interface PreviewProps {
  code: string
  error: string
}

const html = `
<html>
  <head>
    <style>html { background-color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError = (e) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + e + '</div>';
        console.error(e);
      }

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error);
      })

      window.addEventListener('message', (e) => {
        try {
          eval(e.data);
        } catch (e) {
          handleError(e);
        }
      }, false);
    </script>
  </body>
</html>
`

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>()

  useEffect(() => {
    iframe.current.srcdoc = html
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*')
    }, 50)
  }, [code])

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
        title='preview'
      />
      {error && <div className='preview-error'>{error}</div>}
    </div>
  )
}

export default Preview
