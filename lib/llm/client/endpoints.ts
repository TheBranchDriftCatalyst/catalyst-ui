import type { EndpointInfo, EndpointType } from "./types.js";

const MAC_LAN_HINTS = ["192.168.", "10.0.", "mac-node"];
const CLUSTER_HINTS = ["cluster.local", "talos", ".svc"];
const LOCAL_HINTS = ["localhost", "127.0.0.1"];

/** Hostnames served by an EPHEMERAL AWS GPU rig, matched BEFORE the cluster hints.
 *
 * These are *.talos00 names and would otherwise match CLUSTER_HINTS on "talos" and be
 * labelled "Cluster" — true of the relay Pod that terminates them, and badly misleading
 * about the model, which is running on an AWS L40S that bills by the hour and is off
 * most of the time. Order matters here; keep this loop above the cluster one.
 *
 * Each entry carries its own label so the dropdown can say which RIG, not just that it
 * is a rig: the two serve different workloads and are armed independently. */
const RIG_HOSTS: Array<[string, string]> = [
  ["ollama.talos00", "AWS rig · vLLM"],
  ["imagegen.talos00", "AWS rig · ComfyUI"],
  ["comfy.talos00", "AWS rig · ComfyUI"],
];

const CLOUD_LABELS: Array<[string, string]> = [
  ["openai.com", "OpenAI"],
  ["anthropic.com", "Anthropic"],
  ["googleapis.com", "Google"],
  ["runpod.ai", "RunPod"],
  ["runpod.net", "RunPod"],
];

export function getEndpointInfo(apiBase?: string): EndpointInfo {
  if (!apiBase) {
    return { label: "Cloud", type: "cloud" };
  }

  const lower = apiBase.toLowerCase();

  for (const hint of LOCAL_HINTS) {
    if (lower.includes(hint)) {
      return { label: "Local", type: "mac", apiBase };
    }
  }

  for (const hint of MAC_LAN_HINTS) {
    if (lower.includes(hint)) {
      return { label: "Mac (LAN)", type: "mac", apiBase };
    }
  }

  for (const [needle, label] of RIG_HOSTS) {
    if (lower.includes(needle)) {
      return { label, type: "rig", apiBase };
    }
  }

  for (const hint of CLUSTER_HINTS) {
    if (lower.includes(hint)) {
      return { label: "Cluster", type: "cluster", apiBase };
    }
  }

  for (const [needle, label] of CLOUD_LABELS) {
    if (lower.includes(needle)) {
      return { label, type: "cloud", apiBase };
    }
  }

  const host = apiBase.replace(/^https?:\/\//, "").split("/")[0];
  return { label: host, type: "cluster" as EndpointType, apiBase };
}
