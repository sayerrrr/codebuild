export type PushMessage = CustomerIOBroadcast | SegmentTrack | SegmentIdentify

export interface CustomerIOBroadcast {
  type: 'CustomerIOBroadcast'
  payload: any
}

export interface SegmentTrack {
  type: 'SegmentTrack'
  payload: any
}

export interface SegmentIdentify {
  type: 'SegmentIdentify'
  payload: any
}
