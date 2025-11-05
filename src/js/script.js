import { Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { AudioPlayer } from '@capawesome-team/capacitor-audio-player';
import {
  AudioRecorder,
  AudioSessionMode,
} from '@capawesome-team/capacitor-audio-recorder';

document.addEventListener('DOMContentLoaded', () => {
  let lastBlob, lastUri;

  const playLastRecording = async result => {
    try {
      await AudioPlayer.play({
        blob: lastBlob,
        uri: lastUri,
      });
    } catch {
      // No-op
    }
  };

  const shareLastRecording = async () => {
    if (lastUri) {
      await Share.share({
        url: lastUri,
      });
    }
  };

  // Event listeners
  AudioRecorder.addListener('recordingError', event => {
    console.error('Recording error', { event });
  });
  AudioRecorder.addListener('recordingPaused', () => {
    console.log('Recording paused');
  });
  AudioRecorder.addListener('recordingStopped', event => {
    console.log('Recording stopped', { event });
  });

  // Buttons
  document
    .querySelector('#cancel-recording-button')
    .addEventListener('click', async () => {
      await AudioRecorder.cancelRecording();
    });
  document
    .querySelector('#get-recording-status-button')
    .addEventListener('click', async () => {
      const status = await AudioRecorder.getRecordingStatus();
      console.log(status);
    });
  document
    .querySelector('#pause-recording-button')
    .addEventListener('click', async () => {
      await AudioRecorder.pauseRecording();
    });
  document
    .querySelector('#resume-recording-button')
    .addEventListener('click', async () => {
      await AudioRecorder.resumeRecording();
    });
  document
    .querySelector('#start-recording-button')
    .addEventListener('click', async () => {
      lastBlob = undefined;
      lastUri = undefined;
      await AudioRecorder.startRecording();
    });
  document
    .querySelector('#stop-recording-button')
    .addEventListener('click', async () => {
      const result = await AudioRecorder.stopRecording();
      console.log('Recording stopped', result);
      lastBlob = result.blob;
      lastUri = result.uri;
      if (lastUri) {
        const statResult = await Filesystem.stat({
          path: lastUri,
        });
        console.log({ statResult });
      }
    });
  document
    .querySelector('#check-permissions-button')
    .addEventListener('click', async () => {
      const result = await AudioRecorder.checkPermissions();
      console.log(result);
    });
  document
    .querySelector('#request-permissions-button')
    .addEventListener('click', async () => {
      const result = await AudioRecorder.requestPermissions();
      console.log(result);
    });
  document
    .querySelector('#play-last-recording-button')
    .addEventListener('click', async () => {
      await playLastRecording();
    });
  document
    .querySelector('#share-last-recording-button')
    .addEventListener('click', async () => {
      await shareLastRecording();
    });
});
