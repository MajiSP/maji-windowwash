local QBCore = exports['qb-core']:GetCoreObject()

local status = 0
local timesCompleted = 0

CreateThread(function()
    while true do
        Wait(0)
        if IsControlJustReleased(0, 38) and status == 0 then
            SetNuiFocus(true, false)
            local PlayerPed = PlayerPedId()
            SendNUIMessage({action = "showNUIWindow", status = true})
            PlaySoundFromEntity(-1, '1st_Person_Transition', PlayerPed, "PLAYER_SWITCH_CUSTOM_SOUNDSET")
            status = 1
        end
        if status == 1 then 
            DisableAllControlActions(0)
        else
            EnableAllControlActions(0)
            status = 0
        end
    end
end)

RegisterNUICallback("closeNUIWindow", function(data)
    print("close attempted")
    if data.type == "callback" then
        SetNuiFocus(false, false)
        SendNUIMessage({action = "showNUIWindow", status = false})
        status = 0
    end
end)

RegisterNUICallback("playSound", function(data)
    print("played sound")
    if data.type == "callback" then
        local PlayerPed = PlayerPedId()
        PlaySoundFromEntity(-1, '1st_Person_Transition', PlayerPed, "PLAYER_SWITCH_CUSTOM_SOUNDSET")
    end
end)