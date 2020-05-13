local nk = require("nakama")
local Util = require("console_util")

local FOREVER = 3600*24*365*10 -- 10 years

local function _validate_create_request(request)
    if request.start_time and type(request.start_time) ~= "number" then
        error({"Invalid start time", 3})
    end
    if request.end_time and type(request.end_time) ~= "number" then
        error({"Invalid end time", 3})
    end
    if request.sort and request.sort ~= "asc" and request.sort ~= "desc" then
        error({"Invalid sort order", 3})
    end

    if request.operator and request.operator ~= "best" and request.operator ~= "set" and request.operator ~= "incr" then
        error({"Invalid operator", 3})
    end

    if not request.duration then
        error({"Invalid duration, must be greater than 0", 3})
    end

    if request.category and (request.category > 127 or request.category < 0) then
        error({"Invalid category, must be between 0 and 127", 3})
    end

    if request.max_size and request.max_size < 0 then
        error({"Invalid max size, must be greater than 0", 3})
    end

    if request.max_num_scores and request.max_num_scores < 0 then
        error({"Invalid max num scores, must be greater than 0", 3})
    end
end

local function _parse_start_time(start_time)
    local ret =  (nk.time() / 1000) -- start now
    if start_time and start_time > 0 then
        ret = ret + start_time
    end
    return ret
end

local function _parse_end_time(end_time)
    if not end_time or end_time <= 0 then
        return FOREVER -- End after FOREVER years
    end
    return end_time
end

local function create(context, payload)
    local request = Util.trim_empty(Util.http_request(context, payload))
    _validate_create_request(request)

    local id = nk.uuid_v4()

    local start_time = _parse_start_time(request.start_time)

    local end_time = start_time +  _parse_end_time(request.end_time)

    nk.tournament_create(
        id, request.sort, request.operator, request.duration, request.reset,
        request.metadata, request.title, request.description,
        request.category, start_time, end_time, request.max_size,
        request.max_num_scores, request.join_required)

    local response = {
        id = id
    }
    return nk.json_encode(response)
end

nk.register_rpc(create, "console.create_tournament")

local function delete(context, payload)
    local request = Util.http_request(context, payload)

    nk.tournament_delete(request.id)
end

nk.register_rpc(delete, "console.delete_tournament")

local function list(context, payload)
    local request = Util.http_request(context, payload)

    local tournaments = nk.tournament_list(
        request.categoryStart or 0,
        request.categoryEnd or -1,
        request.start_time or 0,
        request.end_time or -1,
        request.limit or 20)

    local result = {}
    if tournaments and #tournaments > 0 then
        result["total_count"] = #tournaments
        result["tournaments"] = tournaments
    else
        result["total_count"] = 0
    end

    return nk.json_encode(result)
end

nk.register_rpc(list, "console.list_tournaments")

local function get(context, payload)
    local request = Util.http_request(context, payload)
    local ids = {request.id}
    local tournaments = nk.tournaments_get_id(ids)

    if tournaments and #tournaments > 0 then
        return nk.json_encode(tournaments[1])
    end
    error({"NotFound", 5}) -- Code 5 = NotFound from google.golang.org/grpc/codes
end

nk.register_rpc(get, "console.get_tournament")