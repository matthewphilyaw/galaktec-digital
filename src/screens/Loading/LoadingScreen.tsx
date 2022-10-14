import styles from './LoadingScreen.module.css';
import {useEffect, useState} from 'react';
import {H4} from '../../components/layout/Heading';

export interface LoadingScreenProps {
  setLoading: (state: boolean) => void;
}

export default function LoadingScreen({ setLoading }: LoadingScreenProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('Initializing');

  useEffect(() => {
    let currentLine = 0;
    let currentMessage = 0;

    const messageInterval = setInterval(() => {
      if (currentMessage >= messages.length) {
        clearInterval(messageInterval);
        return;
      }

      setMessage(messages[currentMessage]);
      currentMessage++;
    }, 250);

    const logInterval = setInterval(() => {
      if (currentLine >= fakeData.length) {
        clearInterval(logInterval);
        return;
      }

      const row = fakeData[currentLine];
      setLogs(l => [`${row.date} - ${row.type}: ${row.r1} ${row.r2}\n`, ...l])
      currentLine++;
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(logInterval);
    };
  }, [])


  return (
    <div className={styles.content}>
      <div className={styles.hidden}>
        <div style={{font: '300 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '400 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '500 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '700 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '900 1rem Roboto'}}>&nbsp;test</div>
        <div style={{font: '300 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '400 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '500 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '700 1rem Roboto mono'}}>&nbsp;test</div>
        <div style={{font: '900 1rem Roboto mono'}}>&nbsp;test</div>
      </div>
      <div className={styles.loading}>
        <div>
          <H4>{message}</H4>
        </div>
        <div className={styles.meter}>
          <span className={styles.bar} onAnimationEnd={() => setLoading(false) } />
        </div>
        <div className={styles.statusContainer}>
          <div className={styles.vertSpacer} />
          <pre className={styles.statusText}>
            {logs.map((l) => l)}
          </pre>
          <div className={styles.vertSpacer} />
        </div>
      </div>
    </div>
  )
}

const messages = [
  'Initializing important things.',
  'Setting up random items.',
  'Plugging the power cable in.',
  'Pressing the power button with eyes closed.',
  'Secretly distracting you while web fonts load.',
  'And yes, the logs below are a lie.',
];

const fakeData = [
  {"date":"2037-06-16T01:29:39Z","type":"vestibulum","r1":null,"r2":"444fadd7510d0526436bbf61132baf8f1b359678"},
  {"date":"2036-05-27T19:16:15Z","type":"nec","r1":null,"r2":"4e389220d6a53885f6cb21bc029a89c953f57302"},
  {"date":"2031-02-18T22:20:41Z","type":"ante","r1":"42-70-F8-B0-01-E0","r2":"7433ef8a8054e346aae052ce41d9f4502570c4e5"},
  {"date":"2024-05-12T22:52:04Z","type":"eu","r1":"33-80-4E-2B-80-B2","r2":null},
  {"date":"2045-09-12T04:40:11Z","type":"maecenas","r1":null,"r2":"ccdc3e6685fe37fe389a49af3c01fbda56791e1f"},
  {"date":"2025-06-16T18:31:54Z","type":"quam","r1":"1A-E2-71-1C-CC-B3","r2":"f74df40b6399a0896efd05d828faa83ea1a67be7"},
  {"date":"2025-12-03T14:15:15Z","type":"sed","r1":null,"r2":"1a64028d5291fdb5d40f75cf05a1b4503ef58f50"},
  {"date":"2037-07-22T17:04:03Z","type":"dui","r1":null,"r2":null},
  {"date":"2028-01-30T09:11:21Z","type":"pede","r1":"A3-A1-99-D5-6B-21","r2":null},
  {"date":"2036-03-04T04:29:51Z","type":"felis","r1":"87-C0-B4-6D-76-67","r2":"a8ae2f4c4f05c38bed84024e8093953a243f4cca"},
  {"date":"2037-07-20T22:09:18Z","type":"nulla","r1":"70-8C-30-C6-C1-8C","r2":"1c54b037c441bdc2ade7eeb6457d4d8ce21e13bf"},
  {"date":"2035-02-22T11:28:12Z","type":"ligula","r1":"F3-75-6F-93-B4-0F","r2":"b5df6985b59d49758bb9115113ffc6228e71f6df"},
  {"date":"2027-06-24T14:29:13Z","type":"eros","r1":"C9-E3-2F-62-BF-F7","r2":"b441d9df9f327c9fa7ede0341690f88310aaf682"},
  {"date":"2026-06-13T16:56:45Z","type":"pellentesque","r1":"BD-71-5C-D5-CB-8A","r2":null},
  {"date":"2032-10-03T14:19:29Z","type":"aenean","r1":"24-F9-3E-27-29-1D","r2":null},
  {"date":"2043-04-02T16:06:04Z","type":"sit","r1":null,"r2":"969f01716dc83f87a29ad8a5cce167c018953f7c"},
  {"date":"2029-02-17T19:26:30Z","type":"aliquet","r1":"B6-8B-23-E0-F4-59","r2":null},
  {"date":"2045-11-29T21:23:32Z","type":"luctus","r1":null,"r2":"f5db6d58ab7c960fbc6652c58cbae2dd70ff936d"},
  {"date":"2039-11-29T12:14:05Z","type":"imperdiet","r1":"E6-CD-7D-8A-61-AB","r2":"818b5c77c293ca87a9ef2e99276053040090fc73"},
  {"date":"2042-03-21T18:50:53Z","type":"molestie","r1":null,"r2":null},
  {"date":"2022-09-04T09:35:21Z","type":"sapien","r1":"BF-D3-15-C1-E1-0F","r2":null},
  {"date":"2031-03-23T16:19:11Z","type":"nulla","r1":"4F-78-F7-83-4B-8D","r2":null},
  {"date":"2042-01-29T11:36:10Z","type":"feugiat","r1":"DB-11-63-C0-6C-68","r2":"31d8d3c3b6988350728216532d4ee834c96f9084"},
  {"date":"2023-01-19T20:57:14Z","type":"ipsum","r1":null,"r2":"067316cd20bae721591805ebbec48457b15bc5cc"},
  {"date":"2043-07-13T18:08:51Z","type":"odio","r1":null,"r2":null},
  {"date":"2036-10-01T15:57:50Z","type":"interdum","r1":"8C-0B-95-E6-C9-F8","r2":null},
  {"date":"2037-12-15T03:16:38Z","type":"primis","r1":"9A-54-27-38-BD-2F","r2":null},
  {"date":"2045-03-31T12:01:49Z","type":"velit","r1":null,"r2":"6b967475a00b66b951ac6a4e1f30bbd78e137383"},
  {"date":"2028-05-01T17:18:01Z","type":"odio","r1":"5F-D2-BC-F1-EB-97","r2":"addf0c736e8379e0a2ed9d9fa09b6313560d2b18"},
  {"date":"2029-07-07T06:14:32Z","type":"diam","r1":"8C-F2-6E-9D-F6-03","r2":"5a0db852f4175805033bb76bcd4e8375fbf263f5"},
  {"date":"2023-07-30T04:49:48Z","type":"etiam","r1":null,"r2":null},
  {"date":"2040-05-24T12:55:37Z","type":"in","r1":null,"r2":"efc4115f9c776ed5b855627c51cfff151e481b5f"},
  {"date":"2045-04-19T14:17:18Z","type":"turpis","r1":"5A-93-32-1D-7A-18","r2":"e8cb735a4c2a39894f523f22e6161c11a5837bc7"},
  {"date":"2023-12-26T09:23:43Z","type":"risus","r1":"BA-C4-22-5E-66-D5","r2":null},
  {"date":"2042-06-17T20:37:29Z","type":"eget","r1":"AD-AC-54-3C-45-33","r2":"0af5f32309bad98c280f226e076b6cb0bd76a779"},
  {"date":"2022-10-12T08:34:35Z","type":"eget","r1":"C2-B7-B6-B9-BD-25","r2":null},
  {"date":"2034-11-05T17:04:40Z","type":"consequat","r1":null,"r2":"b26eab1edbd842cb834f2a38d1fd4f8bf72d6fe2"},
  {"date":"2027-12-20T00:01:51Z","type":"odio","r1":"5A-01-6B-9E-BE-1B","r2":"240736f38149710ce6126e69025e4803f116fd3c"},
  {"date":"2045-03-16T12:03:41Z","type":"elementum","r1":"2D-4A-7A-FE-F2-F2","r2":null},
  {"date":"2032-05-23T17:48:25Z","type":"consequat","r1":"72-43-94-BC-B2-83","r2":"430a014a9ea689b6061d2d8f2deb6c55d5025ad6"},
  {"date":"2022-02-16T03:07:22Z","type":"vestibulum","r1":"7A-C5-74-91-43-54","r2":null},
  {"date":"2038-02-27T02:11:49Z","type":"mus","r1":"68-02-FD-66-64-D5","r2":"bea9f76378600b1f2a5115e669dfbebdb7b7a4fd"},
  {"date":"2045-07-28T16:31:54Z","type":"sapien","r1":"63-B6-64-AC-6C-2A","r2":"bb65332806187327456988a977585c6a34ec2f54"},
  {"date":"2047-03-24T08:33:40Z","type":"at","r1":"FE-77-64-47-7B-29","r2":null},
  {"date":"2032-06-18T09:47:55Z","type":"congue","r1":"0F-A1-8B-0C-F9-9A","r2":null},
  {"date":"2045-12-20T23:31:22Z","type":"nisl","r1":"22-B1-22-77-86-5A","r2":null},
  {"date":"2044-03-31T01:32:28Z","type":"vel","r1":"85-21-5F-8D-30-D4","r2":null},
  {"date":"2037-01-27T23:16:41Z","type":"ut","r1":"47-9F-1F-23-C7-C1","r2":"10026abfa0acb947bb03f4788136c43dce80f24a"},
  {"date":"2034-07-12T21:25:05Z","type":"placerat","r1":"5D-20-C0-8A-42-D3","r2":null},
  {"date":"2039-05-26T09:31:54Z","type":"turpis","r1":"00-85-E6-64-5A-F0","r2":"92d2c98cda1a21418eceab90a59312b42f30ecbf"},
  {"date":"2036-06-13T07:16:52Z","type":"quis","r1":"54-AF-90-42-21-01","r2":null},
  {"date":"2044-01-27T18:28:32Z","type":"dictumst","r1":"B6-1C-13-A8-5C-B2","r2":"8f251fe1f974e8a811428b73ec97fc084b8eb096"},
  {"date":"2029-01-22T01:22:09Z","type":"libero","r1":"7E-C2-7E-52-61-64","r2":"5b0802ed2a0e06ec7d7003fecf66c212500524a6"},
  {"date":"2026-11-07T19:21:42Z","type":"parturient","r1":"19-A1-D0-AB-6C-8C","r2":null},
  {"date":"2044-02-01T04:33:26Z","type":"ac","r1":"59-17-EB-81-00-CC","r2":null},
  {"date":"2034-10-31T21:18:45Z","type":"lectus","r1":null,"r2":"b2e086a9a72fb4d1671416bba2ad9dec9017557b"},
  {"date":"2027-12-07T23:39:43Z","type":"quis","r1":"5F-3D-3D-6E-B5-08","r2":null},
  {"date":"2045-05-20T00:58:57Z","type":"risus","r1":"51-7D-7E-8D-28-2B","r2":"49e92a564bc7b91a796d5b8a8da63ae4f8ae99d7"},
  {"date":"2039-04-08T17:41:02Z","type":"quam","r1":"F1-63-43-57-4A-D1","r2":null},
  {"date":"2045-01-11T22:16:47Z","type":"condimentum","r1":null,"r2":"f3c2e55d72eb00d2ac43cc8601e7a580d4d9910d"},
  {"date":"2022-03-10T11:02:04Z","type":"scelerisque","r1":null,"r2":null},
  {"date":"2040-01-25T03:37:54Z","type":"viverra","r1":"37-1C-6F-A0-D3-EE","r2":null},
  {"date":"2041-01-13T03:18:16Z","type":"justo","r1":"51-A9-69-01-3F-15","r2":null},
  {"date":"2024-09-22T14:19:56Z","type":"dictumst","r1":"94-C1-98-DA-4F-02","r2":"d0f751616b37bae7e248f521b6bf56951c977021"},
  {"date":"2042-11-09T06:53:00Z","type":"integer","r1":"70-86-83-3A-77-02","r2":null},
  {"date":"2037-02-27T06:48:20Z","type":"donec","r1":"F3-A4-D6-6A-4E-00","r2":null},
  {"date":"2034-11-04T10:19:31Z","type":"quis","r1":"03-F0-B5-93-9B-B6","r2":"ef51588056efdcabb7e06f1e5332aec57dc2ac07"},
  {"date":"2027-08-13T11:59:33Z","type":"lectus","r1":"D0-C3-FB-1F-18-96","r2":"6787f6912cae4c547ce5a9ce7b37027ca023fcd4"},
  {"date":"2040-12-28T17:52:46Z","type":"orci","r1":"2F-DD-57-80-98-9E","r2":"ddc95b41598483017b6456e5f00fc97b53eaeaf3"},
  {"date":"2043-05-02T12:34:24Z","type":"cras","r1":"42-21-09-DB-80-7D","r2":"a6041c11d28911886cd74e66f22b703c9fba4b8d"},
  {"date":"2036-11-15T02:57:43Z","type":"amet","r1":"F6-8F-53-69-5A-27","r2":null},
  {"date":"2032-08-05T10:46:06Z","type":"vestibulum","r1":"A4-36-E2-58-CE-A1","r2":null},
  {"date":"2036-05-16T03:34:37Z","type":"vulputate","r1":"39-E6-7B-65-0A-7A","r2":"75df70b4db8e0b46b4dae4be9d937fc60b1c83f0"},
];