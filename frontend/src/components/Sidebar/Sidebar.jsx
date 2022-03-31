import React, { useEffect, useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import cn from 'classnames'
// import mime from 'mime-types'

import { Title, Paragraph, Button, Link } from '@components'
import { formatDate } from '@utils'

import styles from './Sidebar.module.css'

const Sidebar = ({ event: newEvent, loading, onClose: handleClose, handlePlain, datum, convertSrc, setConvertSrc, eventIndex, err, setErr, lfsSrc, setLFSSrc, assetPath }) => {
  const [event, setEvent] = useState(newEvent)

  useEffect(() => {
    if(typeof newEvent !== 'undefined') {
      setEvent(newEvent)
    }
  }, [newEvent])

  // useEffect(() => console.log( event ))

  const ffmpeg = createFFmpeg({
    corePath: 'https:unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
    log: true,
  });

  // breaks in firefox if dev tools are open
  const doTranscode = async (path) => {
    try {
      // console.log('Loading ffmpeg-core.js')
      if (!ffmpeg.isLoaded()) {await ffmpeg.load()}
      console.log('Start transcoding', path)
      var ext = re.exec(path)[1]?.trim()
      var filename = 'test.' + ext
      ffmpeg.FS('writeFile', filename, await fetchFile('/api/' + encodeURIComponent(path)))
      await ffmpeg.run('-i', filename, 'test.mp4')
      console.log('Complete transcoding')
      const data = ffmpeg.FS('readFile', 'test.mp4')
      setConvertSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })))
    } catch (e) {
      console.log(e)
      setErr(e.toString())
    }
  };

  const unoconv = async (path) => {
    // const resp1 = await fetch('/api/' + path)
    // const blob1 = await resp1.blob()
    // const mimetype = mime.lookup(path)
    // const resp2 = await fetch(`${process.env.REACT_APP_UNOCONV_URL}/convert/format/pdf/output/newname.pdf`,
    //                           { method: 'POST',
    //                             body: blob1,
    //                             headers: {
    //                               'Content-Type': mimetype,
    //                               'Content-Disposition': 'attachment; filename="example.docx"'
    //                             },
    //                           })
    // const blob2 = await resp2.blob()
    // setConvertSrc(URL.createObjectURL(blob2, { type: 'application/pdf' }))
  };

  var re =/(?:\.([^.]+))?$/
  var ext = re.exec(event?.FILE_PATH)[1]?.trim()

  const img = ["BMP", "GIF", "ICO", "JPEG", "JPG", "NPO", "PNG", "TIF", "bmp", "eps", "gif", "ico", "jpeg", "jpg", "png", "svg", "tif", "webp", "MPO", "heic", "HEIC"]
  const vid = ["AVI", "BUP", "IFO", "MOV", "MP4", "VOB", "avi", "flv", "m2v", "m4v", "mov", "mp4", "swf", "webm"]
  const src = ["PDF", "Pdf", "acsm", "mobi", "pdf", "pub", "xps"]
  const wav = ["caf", "MOD", "aac", "m3u", "m4a", "mid", "mp3", "ogg", "pk", "flac"]
  const web = ["less", "sass", "scss", "css", "htm", "html", "js", "mht", "url", "xml"]
  const iframeable = img + vid + src + wav + web

  // button to fetch plain text and insert as datum
  return (
    <div
      className={cn(
        styles.sidebar,
        { [styles.invisible]: !newEvent },
      )}
    >
      <div className={styles.container}>
        <div className={styles.sticky}>
          <Title>{formatDate(event?.HOST_DATE)} {eventIndex}</Title>
          <Button type="button" onClick={handleClose}>X</Button>
          { (process.env.REACT_APP_BUILD_MODE === "local") && (
            <div>
              <Button type="button" onClick={() => handlePlain(assetPath)}>🖊</Button>
              <Button type="button" onClick={() => unoconv(assetPath)}>📄</Button>
              <Button type="button" onClick={() => doTranscode(assetPath)}>🔈</Button>
              {assetPath && (
                <Paragraph>
                  <Link href={assetPath} target="_blank" rel="noreferrer">{assetPath}</Link>
                </Paragraph>
              )}
              {/* <Paragraph>{event?.UUID}</Paragraph> */}
            </div>
          )}
          {event?.DATUM && (
            <Paragraph>{event?.DATUM}</Paragraph>
          )}
          <Paragraph>{datum}</Paragraph>
          {iframeable.includes(ext) && assetPath != "" && (
            <Paragraph><iframe title="iframe" src={assetPath} width="100%" height="800px"></iframe></Paragraph>
          )}
          <div>
          {convertSrc && (
            <Paragraph><iframe title="iframe" src={convertSrc} width="100%" height="800px"></iframe></Paragraph>
          )}
          {lfsSrc && (
            <Paragraph><iframe title="iframe" src={lfsSrc} width="100%" height="800px"></iframe></Paragraph>
          )}
          </div>
          <Paragraph>{err}</Paragraph>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
