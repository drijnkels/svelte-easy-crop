<script lang="ts">
  import queryString from 'query-string'
  import Cropper from '../lib'
  import type { ObjectFit, CropShape, cropData } from '$lib/types'
  import { getCroppedImg } from '$lib/canvasUtils'

  let crop = { x: 0, y: 0 }
  let zoom = 1
  let objectFit: ObjectFit = 'contain';
  let cropShape: CropShape = 'rect';
  let zoomSpeed = 1;
  let maxZoom = 3;
  let minZoom = 0.5;
  let percent = {height: 100, width: 100, x: 0, y: 0};
  let pixels = {height: 100, width: 100, x: 0, y: 0};
  let showGrid = true;

  const urlArgs = typeof window !== 'undefined' ? queryString.parse(window.location.search) : null
  let image = typeof urlArgs?.img === 'string' ? urlArgs.img : '/images/cat.jpeg' // so we can change the image from our tests
  let cropped_image = '';

  const setCropData = (data: cropData) => {
    percent = data.percent;
    pixels = data.pixels;
  }
  const roundTwoDecimals = (number: number) => {
    return Math.round(number * 100) / 100;
  }

  const createPreview = async () => {
    cropped_image = await getCroppedImg(image, zoom, {
      width: pixels.width,
      height: pixels.height,
      shape: cropShape,
      x: pixels.x,
      y: pixels.y
    });
  }
</script>

<div class="wrapper">
  <div class="flex gap-4">
    <div class="flex flex-col">
      <div class="crop_container">
        <Cropper
          {image}
          aspect={1}
          bind:crop
          bind:zoom
          {objectFit}
          {zoomSpeed}
          {cropShape}
          {maxZoom}
          {minZoom}
          {showGrid}
          on:cropcomplete={e => setCropData(e.detail)}
        />
      </div>
      <button on:click={() => createPreview()}>Create preview</button>

      <div class="settings flex flex-col">
        <div class="row"><b>Settings <i>(All numbers are rounded)</i></b></div>
        <div class="row gap-4">
          <div class="col">
            Crop: x: {roundTwoDecimals(crop.x)}, y: {roundTwoDecimals(crop.y)}<br />
            zoom: {roundTwoDecimals(zoom)}
          </div>
          <div class="col">
            <div class="row">
              Percent: height: {roundTwoDecimals(percent.height)}, width: {roundTwoDecimals(percent.width)}, x: {roundTwoDecimals(percent.x)}, y: {roundTwoDecimals(percent.y)}
            </div>
            <div class="row">
              Pixels: height: {pixels.height}, width: {pixels.width}, x: {pixels.x}, y: {pixels.y}
            </div>
          </div>
        </div>
        <div class="row gap-2">
          <div class="col setting">
            <b>objectFit</b><br />
            <select bind:value={objectFit}>
              <option value="contain">Contain</option>
              <option value="horizontal-cover">horizontal-cover</option>
              <option value="vertical-cover">vertical-cover</option>
            </select>
          </div>
          <div class="col setting">
            <b>cropShape</b><br />
            <select bind:value={cropShape}>
              <option value="rect">rect</option>
              <option value="round">round</option>
            </select>
          </div>
          <div class="col setting">
            <b>showGrid</b><br />
            <select bind:value={showGrid}>
              <option value={true}>Grid on</option>
              <option value={false}>Grid off</option>
            </select>
          </div>
        </div>
        <div class="row gap-2">
          <div class="col setting">
            <b>zoomSpeed</b><br />
            <input name="zoomSpeed" bind:value={zoomSpeed} />
          </div>
          <div class="col setting">
            <b>Max zoom</b><br />
            <input name="maxZoom" bind:value={maxZoom} />
          </div>
          <div class="col setting">
            <b>Min zoom</b><br />
            <input name="minZoom" bind:value={minZoom} />
          </div>
        </div>
      </div>

    </div>
    <div class="preview">
      <b>Preview</b><br />
      <div class="preview_image">
      {#if cropped_image}
        <img src={cropped_image} alt="Preview of cropped result" />
      {/if}
      </div>
    </div>
  </div>

</div>

<style>
  .wrapper{
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
  }
  .crop_container{
      position: relative;
      width: 450px;
      height: 450px;
      margin-bottom: 16px;
  }
  .preview{

  }
  .preview_image{
      border: 1px solid lightgray;
      width: 361px;
      height: 361px;
  }
  button{
      margin-bottom: 8px;
  }
  .settings{
      margin: 0 auto;
      width: 450px;
      gap: 8px;
  }
  .settings .setting{
      display: flex;
      flex-direction: column;
      gap: 4px;
  }
  .settings .setting input {
      width: 60px;
  }
  .row{
      display: flex;
  }
  .col{
      display: flex;
      flex-direction: column;
  }
  .flex{
      display: flex;
  }
  .flex-col{
      flex-direction: column;
  }
  .gap-2{
      gap: 8px;
  }
  .gap-4{
      gap: 16px;
  }
</style>