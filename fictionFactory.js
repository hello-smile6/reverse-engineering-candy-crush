function loadFictionFactory(commonParameters, fictionFactoryParameters) {
  initializeTracking(
    commonParameters.hostName,
    commonParameters.sessionKey,
    commonParameters.signInSourceId,
    commonParameters.coreUserId
  );

  $("#templateScript").load(
    fictionFactoryParameters.gameTemplateUrl,
    function () {
      compileFictionFactoryViewTemplate(fictionFactoryParameters);
      trackLoadingStep("HTMLLoadScripts");
      showFictionFactory(commonParameters, fictionFactoryParameters);
    }
  );
}

function compileFictionFactoryViewTemplate(fictionFactoryParameters) {
  var source = $("#fictionFactory-template").html();
  var template = Handlebars.compile(source);
  $("#game").replaceWith(template(fictionFactoryParameters));
}

function injectLegacyParameters(fictionFactoryParameters) {
  Object.keys(fictionFactoryParameters.legacyParameters).forEach(function (
    key
  ) {
    window[key] = fictionFactoryParameters.legacyParameters[key];
    console.log(
      "window." + key + " = " + fictionFactoryParameters.legacyParameters[key]
    );
  });
}

function showFictionFactory(commonParameters, fictionFactoryParameters) {
  trackLoadingStep("HTMLTopOfHead");
  loadScript(fictionFactoryParameters.fictionFactoryInitJsUrl, function () {
    trackLoadingStep("HTMLLoadedFFScript");

    jsking = window.jsking || {};
    jsking.facebook = {
      appId: commonParameters.facebookAppId.toString(),
      appUrl: commonParameters.facebookCanvasPageFullUrl.toString(),
      accessToken: commonParameters.skipAccessTokenFromParams
        ? null
        : commonParameters.facebookAccessToken.toString(),
      useFloating: false,
    };
    jsking.init = {
      gameId: "game",
      userId: commonParameters.coreUserId.toString(),
      sessionKey: commonParameters.sessionKey.toString(),
      cdn: commonParameters.cdnUrl.toString(),
      storage: fictionFactoryParameters.preallocateStorage,
      locale: commonParameters.locale.toString(),
      remoteRpcServiceUrl: commonParameters.apiUrl.toString(),
      network: commonParameters.signInNetworkName.toString(),
    };
    //required by emscripten (do not remove)
    emscriptenvars = {
      buildVariation: fictionFactoryParameters.environment
        .toString()
        .toLowerCase(),
      apiUrl: commonParameters.apiUrl.toString(),
    };
    //!
    injectLegacyParameters(fictionFactoryParameters);

    var module = {
      "core.network": commonParameters.signInNetworkName.toString(),
      "core.locale": commonParameters.locale.toString(),
      "ksdk.userId": commonParameters.coreUserId.toString(),
      "ksdk.sessionKey": commonParameters.sessionKey.toString(),
      "ksdk.facebook.accessToken": commonParameters.skipAccessTokenFromParams
        ? null
        : commonParameters.facebookAccessToken.toString(),
      facebookUrl: window.location.href,
    };
    if (fictionFactoryParameters.slayerUrl != null) {
      module["ksdk.slayerApiUrl"] =
        fictionFactoryParameters.slayerUrl.toString();
    }
    if (fictionFactoryParameters.gzipPostThresholdBytes > 0) {
      (module["core.gzipPostEnabled"] = true),
        (module["core.gzipPostThresholdBytes"] =
          fictionFactoryParameters.gzipPostThresholdBytes);
    }

    var kingInitParams = {};
    if (fictionFactoryParameters.fictionFactoryWasmGameJsLoaderUrl != null) {
      kingInitParams["useWasmIfSupported"] = true;
      kingInitParams["appJsWasm"] =
        fictionFactoryParameters.fictionFactoryWasmGameJsLoaderUrl.toString();
      kingInitParams["appWasm"] =
        fictionFactoryParameters.fictionFactoryWasmUrl.toString();
    }
    var gameClientSettingsFile =
      fictionFactoryParameters.fictionGameClientSettingsFile ||
      fictionFactoryParameters.fictionFactoryWasmSettingsUrl;
    if (gameClientSettingsFile) {
      kingInitParams["gameClientSettingsFile"] =
        gameClientSettingsFile.toString();
    }
    if (fictionFactoryParameters.fictionGameClientSettingsMd5File) {
      kingInitParams["gameClientSettingsMd5File"] =
        fictionFactoryParameters.fictionGameClientSettingsMd5File.toString();
    }

    kingInitParams = mergeLists(kingInitParams, {
      appJs: fictionFactoryParameters.fictionFactoryGameJsLoaderUrl.toString(),
      appAsmJs: fictionFactoryParameters.fictionFactoryAsmUrl.toString(),
      appParentId: "view-game",
      width: fictionFactoryParameters.gameWidth,
      height: fictionFactoryParameters.gameHeight,
      memFile: fictionFactoryParameters.fictionFactoryJsMemUrl.toString(),
      dataFile: fictionFactoryParameters.fictionFactoryAssetsDataUrl.toString(),
      dataMetaFile:
        fictionFactoryParameters.fictionFactoryAssetsMetaDataUrl.toString(),
      appVersion: fictionFactoryParameters.appVersion.toString(),
      appLocale: commonParameters.locale.toString(),
      viewController: getViewController(),
      gameId: commonParameters.kingAppId.toString(),
      browserErrorAsEvent: true,
      memoryFragmentationAsEvent:
        fictionFactoryParameters.memoryFragmentationAsEvent,
      preallocateHeapSize: fictionFactoryParameters.preallocateHeapSize,
      preallocateHeapSizeMin: fictionFactoryParameters.preallocateHeapSizeMin,
      userId: commonParameters.coreUserId.toString(),
      customBlacklist: [],
      crashWriter: {
        install_id:
          "Emscripten-Facebook-" + fictionFactoryParameters.appVersion,
        sign_in_source: commonParameters.signInSourceId,
        core_user_id: commonParameters.coreUserId,
        build_id: fictionFactoryParameters.fictionFactoryBuildId.toString(),
        rpc: {
          host: commonParameters.hostName.toString(),
          page: "rpc/ClientApi",
          session_id: commonParameters.sessionKey.toString(),
        },
      },
      tracking: {
        sign_in_source: commonParameters.signInSourceId,
        core_user_id: commonParameters.coreUserId,
        rpc: {
          host: commonParameters.hostName.toString(),
          page: "rpc/ClientApi",
          session_id: commonParameters.sessionKey.toString(),
        },
      },
      startBlocker: (function () {
        var socialInitialized = false;
        try {
          king.util.callAfterInit(function () {
            if (
              commonParameters.skipAccessTokenFromParams &&
              king.social != undefined
            ) {
              var accessToken = king.social.getAccessToken();
              jsking.facebook.accessToken = accessToken;
              module["ksdk.facebook.accessToken"] = accessToken;
            }
            socialInitialized = true;
          });
        } catch (e) {
          return undefined;
        }
        return function () {
          return socialInitialized ? null : "Connecting to a social network...";
        };
      })(),
      Module: module,
    });

    console.log(kingInitParams);
    king.ff.init(kingInitParams);
  });
}

function initializeTracking(hostName, sessionKey, signInSourceId, coreUserId) {
  trackLoadingStep = (function (tracking) {
    return function (loadingStep) {
      var protocol = tracking.rpc.secure ? "https://" : "//";
      var isHttps =
        tracking.rpc.secure || "https:" == document.location.protocol;
      var port = isHttps ? tracking.rpc.securePort : tracking.rpc.port;
      var url =
        protocol + tracking.rpc.host + ":" + port + "/" + tracking.rpc.page;
      if (tracking.rpc.session_id)
        url += "?_session=" + tracking.rpc.session_id;
      var mFunnelId =
        window.TrackingFunnelId ||
        (window.TrackingFunnelId = String(Date.now()));
      var http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.timeout = 15 * 1000;
      http.ontimeout =
        http.onabort =
        http.onerror =
          function (error) {
            var watcher = setInterval(function () {
              var checkpoint = null;
              try {
                checkpoint = king.ff.Engine.trackCheckpoint;
              } catch (e) {
                checkpoint = null;
              }
              if (typeof checkpoint === "function") {
                checkpoint(loadingStep);
                clearInterval(watcher);
              }
            }, 1000);
          };
      http.onload = function () {
        if (
          http.status === 200 ||
          http.status === 304 ||
          http.status === 206 ||
          (http.status === 0 && http.response)
        ) {
        } else {
          http.onerror(null);
        }
      };
      http.send(
        JSON.stringify([
          {
            jsonrpc: "2.0",
            method: "TrackingApi.track",
            id: 0,
            params: [
              tracking.sign_in_source,
              0,
              "",
              {
                type: 7501,
                parameters: [
                  tracking.core_user_id,
                  mFunnelId,
                  loadingStep,
                  Date.now(),
                ],
              },
            ],
          },
        ])
      );
    };
  })({
    rpc: {
      host: hostName,
      page: "rpc/ClientApi",
      session_id: sessionKey.toString(),
      securePort: 443,
      port: 80,
      secure: false,
    },
    sign_in_source: signInSourceId,
    core_user_id: coreUserId,
  });
}

function getViewController() {
  return (function () {
    var progressElement = document.getElementById("prelaoder-progress");
    var mLastScreen = "";
    var mScreens = {};
    var isInitialized = 0;
    var showDownloadGameTextIntervalId;
    var downloadGameTextIndex;

    function addScreen(name, domObject) {
      if (domObject && domObject.style && domObject.style.display) {
        mScreens[name] = domObject;
        domObject.style.display = "none";
      }
    }

    function switchToScreen(screen) {
      if (screen == mLastScreen) {
        return;
      }
      mLastScreen = screen;
      isInitialized == 0 && addScreens();
      for (var screenId in mScreens) {
        if (screenId == screen) {
          mScreens[screenId].style.display = "inherit";
        } else {
          mScreens[screenId].style.display = "none";
        }
      }
      document.getElementById("view-background").style.display =
        screen == "game" ? "none" : "inherit";
    }

    function addScreens() {
      isInitialized = 1;
      addScreen("game", document.getElementById("view-game"));
      addScreen("loading", document.getElementById("view-preloader"));
      addScreen("fatal", document.getElementById("view-fatal"));
      addScreen("memory-error", document.getElementById("view-memory-error"));
    }

    var OnLoadingStatus = function (status, progress) {
      progressElement.children[0].style.width = progress + "%";
      switchToScreen("loading");
      startShowDownloadGameText();
    };

    var OnLoadingDone = function () {
      switchToScreen("game");
      stopShowDownloadGameText();
    };

    var updateDownloadGameText = function () {
      if (!window.canvasParameters) {
        return;
      }
      if (!window.canvasParameters.fictionFactoryParameters) {
        return;
      }
      var downloadGameTextValues =
        window.canvasParameters.fictionFactoryParameters
          .textFrameDownloadingGame;
      if (!downloadGameTextValues || !Array.isArray(downloadGameTextValues)) {
        return;
      }
      var downloadGameDiv = document.getElementById("prelaoder-status");
      if (!downloadGameDiv) {
        return;
      }
      downloadGameDiv.innerHTML = downloadGameTextValues[downloadGameTextIndex];
      downloadGameTextIndex =
        (downloadGameTextIndex + 1) % downloadGameTextValues.length;
    };

    var startShowDownloadGameText = function () {
      if (showDownloadGameTextIntervalId) {
        return;
      }

      downloadGameTextIndex = 0;
      updateDownloadGameText();
      showDownloadGameTextIntervalId = setInterval(function () {
        updateDownloadGameText();
      }, 2000);
    };

    var stopShowDownloadGameText = function () {
      clearInterval(showDownloadGameTextIntervalId);
    };

    var OnMemoryError = function (host64bit) {
      outOfMemoryErrorEncountered();
    };

    var OnFatalError = function (error) {
      fatalErrorEncountered();
    };

    //Void handlers ####################################
    var Init = function (config) {};
    var OnBrowserIncompatible = function () {};
    var OnMobileBrowser = function (mobilePlatform) {};
    var OnMissingWebGL = function () {};
    //####################################
    return {
      Init: Init,
      OnBrowserIncompatible: OnBrowserIncompatible,
      OnMissingWebGL: OnMissingWebGL,
      OnMobileBrowser: OnMobileBrowser,
      OnFatalError: OnFatalError,
      OnMemoryError: OnMemoryError,
      OnLoadingStatus: OnLoadingStatus,
      OnLoadingDone: OnLoadingDone,
    };
  })();
}
